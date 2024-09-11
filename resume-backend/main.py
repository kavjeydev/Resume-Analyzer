from time import sleep
from openai import OpenAI
from pypdf import PdfReader
from google.cloud import storage
import validators
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
import requests, bs4
import asyncio
load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
BUCKET_NAME = 'quixotic-processed-resumes'

THUMBNAIL_BUCKET = 'quixotic-processed-thumbnails'
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="./credentials.json"

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = './resumes'


cred = credentials.Certificate('private_key.json')
firebase_admin.initialize_app(cred)

db = firestore.client()


client = OpenAI(api_key=OPENAI_API_KEY)

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

def delete_files(thumbnails, resumes):
    try:
     files = os.listdir(thumbnails)
     for file in files:
       file_path = os.path.join(thumbnails, file)
       if os.path.isfile(file_path):
         os.remove(file_path)
     print("All files deleted successfully.")
    except OSError:
        print("Error occurred while deleting video files.")

    try:
     files = os.listdir(resumes)
     for file in files:
       file_path = os.path.join(resumes, file)
       if os.path.isfile(file_path):
         os.remove(file_path)
     print("All files deleted successfully.")
    except OSError:
        print("Error occurred while deleting audio files.")

def delete_processed_files(process):
    try:
     files = os.listdir(process)
     for file in files:
       file_path = os.path.join(process, file)
       if os.path.isfile(file_path):
         os.remove(file_path)
     print("All files deleted successfully.")
    except OSError:
        print("Error occurred while deleting audio files.")

async def run_all(filepath, filename):

    extracted_text, thumbnail_path = pdf_to_array(filepath)


    file = f'./resumes/{filename}'


    user_id = filename.split('-')[0]

    count = 0
    while(count < 10):
        valid = verify_resume(extracted_text, client)
        count += 1

        if(valid):
           break


    print(valid)
    if(not valid):
        return False

    # print(get_skills_technical_10(extracted_text, client))

    job_title = get_profession(extracted_text, client)
    job_level = get_level(extracted_text, client)

    # print(job_level, job_title)
    # print(company_applied)

    skills = get_skills(extracted_text, client)

    # print(skills)
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

def validate_job_listing(extracted_text, client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"{extracted_text} is this a valid job listing? respond with just yes or no with no punctuation"}
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

def get_skills_technical_10(extracted_text, client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"{extracted_text} What are the top 50 technical skills highlighted in this resume? Respond with just the 50 skills separated by \'#\' with no spaces and capitalize the beginning of every word please."}
        ]
    )

    skills = (completion.choices[0].message.content)


    return skills.split('#')


def get_skills_soft_10(extracted_text, client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"{extracted_text} What are the top 50 soft skills highlighted in this resume? Respond with just the 50 skills separated by \'#\' with no spaces and capitalize the beginning of every word please."}
        ]
    )

    skills = (completion.choices[0].message.content)

    return skills.split('#')


def get_general_salary_range(job_level, job_title, client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"what is the standard salary range for a {job_level} {job_title}, say only the two numbers (use commas for big numbers) without a dollar sign, separated with a space please"}
        ]
    )

    min_range = (completion.choices[0].message.content).split(' ')[0]
    max_range = (completion.choices[0].message.content).split(' ')[1]


    return min_range, max_range


def get_company_salary_range(job_level, job_title, company_name, client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"what is the standard salary range for a {job_level} {job_title} at {company_name}, say only the two numbers (use commas for big numbers) without a dollar sign, separated with a space please"}
        ]
    )

    min_range = (completion.choices[0].message.content).split(' ')[0]
    max_range = (completion.choices[0].message.content).split(' ')[1]


    return min_range, max_range


def get_listing_salary_range(listing, client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"what is the standard salary range shown in this listing: {listing}, say only the two numbers (use commas for big numbers) without a dollar sign, separated with a space please. If the salary range isn't shown in the listing, say \'None\'"}
        ]
    )
    min_range = 0
    max_range = 0
    if(completion.choices[0].message.content == 'None'):
        return min_range, max_range
    min_range = (completion.choices[0].message.content).split(' ')[0]
    max_range = (completion.choices[0].message.content).split(' ')[1]

    return min_range, max_range

def get_text_from_listing(listing):
    url = listing
    res = requests.get(url)
    html_page = res.content
    soup = bs4.BeautifulSoup(html_page, 'html.parser')
    text = soup.find_all(text=True)

    output = ''
    blacklist = [
        '[document]',
        'noscript',
        'header',
        'html',
        'meta',
        'head',
        'input',
        'script',
        # there may be more elements you don't want, such as "style", etc.
    ]

    for t in text:
        if t.parent.name not in blacklist:
            output += '{} '.format(t)

    # print(output)
    return output

def get_10_technical_from_listing(extracted_text, client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"what are the top 10 technical skills in this listing: {extracted_text}? please answer with just the technical skills separated by \'#\' with no spaces please and capitalize the beginning of every word please."}
        ]
    )

    tech_skills = (completion.choices[0].message.content).split('#')

    return tech_skills

def get_10_soft_from_listing(extracted_text, client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"what are the top 10 soft skills in this listing: {extracted_text}? please answer with just the soft skills separated by \'#\' with no spaces please and capitalize the beginning of every word please."}
        ]
    )

    soft_skills = (completion.choices[0].message.content).split('#')

    return soft_skills

def get_five_company_values(company, client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"what are the top 5 culture values for {company}? please answer with just the culture values separated by \'#\' with no spaces please"}
        ]
    )

    company_values = (completion.choices[0].message.content).split('#')

    return company_values


def get_file_from_bucket(bucket_name, filename, dest_filename):
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)
    folder_path = './process'
    print(filename)
    blob = bucket.get_blob(filename)

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"Nested folders '{folder_path}' created.")
    else:
        print(f"Nested folders '{folder_path}' already exist.")


    print("content", blob.download_to_filename(folder_path + '/' + dest_filename))


def process_resume_all(filename, listing_text): # PUT ANALYZE STUFF TOGETHER HERE
    filepath = f'./process/{filename}'
    get_file_from_bucket(BUCKET_NAME, filename, filename)
    extracted_text_pdf = pdf_to_array(filepath)

    valid_listing = validate_job_listing(listing_text, client)
    count = 0
    while count < 5:
        valid_listing = validate_job_listing(listing_text, client)
        count += 1
        if (valid_listing):
            break

    company = get_company(listing_text, client)
    min_range, max_range = get_listing_salary_range(listing_text, client)

    top_10_techical_resume_skills = get_skills_technical_10(extracted_text_pdf, client)
    top_10_soft_resume_skills = get_skills_soft_10(extracted_text_pdf, client)

    top_10_soft_listing = (get_10_soft_from_listing(listing_text, client))
    top_10_technical_listing = (get_10_technical_from_listing(listing_text, client))

    soft_skills_to_add = []
    tech_skills_to_add = []

    for skill in top_10_soft_listing:
        if skill not in top_10_soft_resume_skills:
            soft_skills_to_add.append(skill)

    for skill in top_10_technical_listing:
        if skill not in top_10_techical_resume_skills:
            tech_skills_to_add.append(skill)

    print(company, min_range, max_range, soft_skills_to_add, tech_skills_to_add)


@app.route("/api/home", methods=["GET"])
def return_home():
    return jsonify({
        'message': 'hello world'
    })

@app.route('/process', methods=['POST'])
def process_file():
    file = request.files['file']
    print("file", file)
    if(file):
        filename = file.filename
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        a = 'file uploaded'

    asyncio.run(run_all(f'./resumes/{file.filename}', file.filename))
    return jsonify({
        'output': 'hi'
    })


@app.route('/get-insight', methods=['POST', 'GET'])
def match_with_listing():
    gcp_filename = (request.form['file'])
    job_listing = request.form['listing']

    extracted_text = get_text_from_listing(job_listing)

    process_resume_all(gcp_filename, extracted_text)


    return jsonify({
        'output': 'hi'
    })

if(__name__ == '__main__'):
    app.run(debug=True, port=8080)




