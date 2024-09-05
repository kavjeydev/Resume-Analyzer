from openai import OpenAI
from pypdf import PdfReader
from google.cloud import storage

from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json

import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
app = Flask(__name__)
CORS(app)

@app.route("/api/home", methods=["GET"])
def return_home():
    return jsonify({
        'message': 'hello world'
    })

@app.route('/process', methods=['POST', 'GET'])
def process_file():
    file = request.files
    filename = ''

    file_data = file
    if(len(file.getlist('file')) > 0):
        filename = file.getlist('file')[0].filename
        print("FILE HERE" , file.getlist('file')[0].filename)



    return jsonify({
        'output': 'hi'
    })

if(__name__ == '__main__'):
    app.run(debug=True, port=8080)




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

def run_all(filepath, job_listing):
    client = OpenAI(api_key=OPENAI_API_KEY)
    extracted_text = pdf_to_array(filepath)


    for i in range(3):
        valid_listing = validate_job_listing(job_listing, client)
        if(valid_listing):
            break

    if(not valid_listing):
        return

    valid = verify_resume(extracted_text, client)
    print(valid)
    if(not valid):
        return

    job_title = get_profession(extracted_text, client)
    job_level = get_level(extracted_text, client)

    company_applied = get_company(job_listing, client)

    print(job_level, job_title)
    print(company_applied)

    skills = get_skills(extracted_text, client)

    print(skills)

def pdf_to_array(filepath):
    reader = PdfReader(filepath)

    # creating a page object
    page = reader.pages[0]

    # extracting text from page
    extracted_text = page.extract_text()

    return extracted_text

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


# run_all('./resumes/example.pdf', 'https://explore.jobs.netflix.net/careers?query=Software%20Engineer%204&utm_source=Netflix+Careersite')



