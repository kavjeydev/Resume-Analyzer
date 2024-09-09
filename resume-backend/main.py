from time import sleep
from openai import OpenAI
from pypdf import PdfReader
from google.cloud import storage

from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db, firestore
import json
from models import Resume
import os
from dotenv import load_dotenv
from pdf2image import convert_from_path

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
BUCKET_NAME = 'quixotic-processed-resumes'

THUMBNAIL_BUCKET = 'quixotic-processed-thumbnails'

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = './resumes'


cred = credentials.Certificate('private_key.json')
firebase_admin.initialize_app(cred)

db = firestore.client()




# print(all_matching_data)


def upload_to_gcs_public(bucket_name, source_file_path, destination_blob_name, credentials_file):
    # Initialize the Google Cloud Storage client with the credentials
    storage_client = storage.Client.from_service_account_json(credentials_file)

    # Get the target bucket
    bucket = storage_client.bucket(bucket_name)

    # Upload the file to the bucket
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_path)
    blob.make_public()

    print(f"File {source_file_path} uploaded to gs://{bucket_name}/{destination_blob_name}")

def run_all(filepath, job_listing, filename):
    client = OpenAI(api_key=OPENAI_API_KEY)
    extracted_text, thumbnail_path = pdf_to_array(filepath)


    file = f'./resumes/{filename}'


    user_id = filename.split('-')[0]


    for i in range(3):
        valid_listing = validate_job_listing(job_listing, client)
        if(valid_listing):
            break

    if(not valid_listing):
        return

    valid = verify_resume(extracted_text, client)
    print(valid)
    if(not valid):
        return False

    job_title = get_profession(extracted_text, client)
    job_level = get_level(extracted_text, client)

    company_applied = get_company(job_listing, client)

    print(job_level, job_title)
    print(company_applied)

    skills = get_skills(extracted_text, client)

    print(skills)
    SOURCE_FILE_PATH = file

    THUMBNAIL_FILE_PATH = thumbnail_path

    CREDENTIALS_FILE = "./credentials.json"
    DESTINATION_BLOB_NAME = filename
    THUMBNAIL_DEST = filename.split('.')[0] + '.jpg'
    upload_to_gcs_public(BUCKET_NAME, SOURCE_FILE_PATH, DESTINATION_BLOB_NAME, CREDENTIALS_FILE) # upload resume
    upload_to_gcs_public(THUMBNAIL_BUCKET, THUMBNAIL_FILE_PATH, THUMBNAIL_DEST, CREDENTIALS_FILE) # upload thumbnail
    doc_ref = db.collection(u'resumes')
    doc_ref.document(filename).set(Resume(filename.split('.')[0], user_id, filename, THUMBNAIL_DEST, skills, job_title, job_level).to_dict())


    query = db.collection(u'resumes').where(u'uid', u'==', f'{user_id}').stream()

    all_matching_data = []

    for doc in query:
        all_matching_data.append(doc.to_dict())
    # print(f'{doc.id} => {doc.to_dict()}')

def pdf_to_array(filepath):
    pages = convert_from_path(filepath)

    for count, page in enumerate(pages):
        page.save(f'./thumbnails/out{count}.jpg', 'JPEG')
    thumbnail_path = f'./thumbnails/out0.jpg'
    reader = PdfReader(filepath)

    # creating a page object
    page = reader.pages[0]

    # extracting text from page
    extracted_text = page.extract_text()

    return extracted_text, thumbnail_path

def verify_resume(extracted_text, client):
    count = 0
    valid = False

    while(count < 3 and not valid):
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": f"{extracted_text} Is the information above a resume? Respond with just \'yes\' or \'no\' please"}
            ]
        )

        yes_or_no = (completion.choices[0].message.content)
        count += 1
        if(yes_or_no.lower() == 'yes'):
            return True


    return False


def get_profession(extracted_text, client):

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"{extracted_text} What job does this resume look like it's applying for? Respond with just the job title please no period at the end."}
        ]
    )

    job_title = (completion.choices[0].message.content)

    return job_title

def get_level(extracted_text, client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"{extracted_text} What job level does this resume look like it's applying for? Respond with just the job level and not the job title please no period at the end and no hyphen in the job level and don't say level. Capitalize the first letter of every word."}
        ]
    )

    job_level = (completion.choices[0].message.content)

    return job_level

def get_company(job_listing, client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"{job_listing} what company's job listing is this? please respond with just the company name and no period at the end"}
        ]
    )

    company = (completion.choices[0].message.content)

    return company

def validate_job_listing(job_listing, client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"{job_listing} is this a valid job listing? respond with just yes or no with no punctuation"}
        ]
    )

    valid = (completion.choices[0].message.content).lower()

    if(valid == 'yes'):
        return True

    return False

def get_skills(extracted_text, client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"{extracted_text} What are the top three hard skills highlighted in this resume? Respond with just the three skills separated by commas and capitalize the beginning of every word please."}
        ]
    )

    skills = (completion.choices[0].message.content)

    return skills.split(', ')


@app.route("/api/home", methods=["GET"])
def return_home():
    return jsonify({
        'message': 'hello world'
    })

@app.route('/process', methods=['POST', 'GET'])
def process_file():
    file = request.files['file']
    print("file", file)
    if(file):
        filename = file.filename
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        a = 'file uploaded'

    run_all(f'./resumes/{filename}', 'https://explore.jobs.netflix.net/careers?query=Software%20Engineer%204&utm_source=Netflix+Careersite', filename)
    return jsonify({
        'output': 'hi'
    })

if(__name__ == '__main__'):
    app.run(debug=True, port=8080)




