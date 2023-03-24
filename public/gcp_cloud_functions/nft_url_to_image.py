import requests
from google.cloud import storage
from google.cloud import secretmanager

# Set up GOOGLE_APPLICATION_CREDENTIALS
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "service_account.json"
# with open(os.environ['GOOGLE_APPLICATION_CREDENTIALS'], 'r') as fp:
#         credentials = json.load(fp)
project_id = 'ethdenver-ar-nft' #credentials['project_id']

def main(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    request_json = request.get_json()
    secret_id = 'cf_ar_nft_url_to_image_secret'
    secret = access_secret_version(project_id,secret_id)
    if request_json and 'secret' in request_json:
        if request_json['secret'] == secret:
            pub_url = get_pub_url(request_json)
            return pub_url
    else:
        return f'Invalid URL has been passed or incorrect JOSN input is passed'

def get_pub_url(request_json):
    """
    request_json - is a JSON object
        ex. request_json = {"secret":"o*6Pd4^5@bd&T@","image_url":"https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg"}
    image_url = 'https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg'

    """
    bucket_name = 'ethdever-ar-nft-public-storage'
    # Overwrite this bucket name if needed to from HTTP Request
    if 'bucket_name' in request_json:
        bucket_name = request_json['bucket_name']        
    image_url = request_json['image_url']
    response = requests.get(image_url)
    content_type = response.headers['content-type']
    img_data = requests.get(image_url).content
    ext = image_url.rsplit('.',1)[1]
    destination_blob_name = str(hash(image_url)) + '.' + ext
    # Send to cloud storage bucket
    pub_url = upload_blob(bucket_name, img_data, destination_blob_name, content_type)
    return pub_url

def access_secret_version(PROJECT_ID, secret_id, version_id="latest"):
    # Create the Secret Manager client.
    client = secretmanager.SecretManagerServiceClient()
    # Build the resource name of the secret version.
    name = f"projects/{PROJECT_ID}/secrets/{secret_id}/versions/{version_id}"
    # Access the secret version.
    response = client.access_secret_version(name=name)
    # Return the decoded payload.
    return response.payload.data.decode('UTF-8')

def upload_blob(bucket_name, source_file_string, destination_blob_name, content_type=None):
    """Uploads a file to the bucket."""
    # The ID of your GCS bucket
    # bucket_name = 'test-sk-asfdasfdasfdasdfas-1232321'
    # The path to your file to upload
    # source_file_name = 'image_name.jpg'
    # The ID of your GCS object
    # destination_blob_name = 'image_name.jpg'
    storage_client = storage.Client.from_service_account_json('service_account.json')
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    # Optional: set a generation-match precondition to avoid potential race conditions
    # and data corruptions. The request to upload is aborted if the object's
    # generation number does not match your precondition. For a destination
    # object that does not yet exist, set the if_generation_match precondition to 0.
    # If the destination object already exists in your bucket, set instead a
    # generation-match precondition using its generation number.
    generation_match_precondition = 0
    blob.upload_from_string(source_file_string, if_generation_match=generation_match_precondition, content_type=content_type)
    print(
        f"File uploaded to {destination_blob_name}."
    )
    pub_url = 'https://storage.googleapis.com/{}/{}'.format(bucket_name,destination_blob_name)
    return pub_url  
