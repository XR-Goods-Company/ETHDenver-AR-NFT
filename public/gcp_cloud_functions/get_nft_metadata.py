import requests
from google.cloud import storage
from google.cloud import secretmanager
from datetime import datetime

project_id = 'ethdenver-ar-nft' 

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
    secret_id = 'cf_get_metadata_nft_secret'
    secret = access_secret_version(project_id,secret_id)
    if request_json and 'secret' in request_json:
        if request_json['secret'] == secret:
            wallet_nft_data_json = get_metadata_nft(request_json)
            return wallet_nft_data_json
    else:
        return f'Invalid URL has been passed or incorrect JOSN input is passed'

def get_metadata_nft(request_json):
    """
    request_json - is a JSON object
        ex. request_json = {"secret":"$ZFgy32HEd8tKSmC3!SmE*","chain_id":"1","wallet_address":"0x51dF6D1c2534C2Cb9348C4Fbd3227e704BA8cd3C","chain_id":"1"}
    image_url = 'https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg'

    """
    bucket_name = 'ethdenver-ar-nft-wallets'
    # Overwrite this bucket name if needed to from HTTP Request
    if 'bucket_name' in request_json:
        bucket_name = request_json['bucket_name']        
    wallet_address = request_json['wallet_address']
    chain_id = request_json['chain_id']
    content_type = 'text/json'
    destination_blob_name = wallet_address + '/' + str(chain_id) + '/' + str(datetime.now().strftime("%Y%m%d%H%M%S%f")) + '.json'
    infura_nft_api_endpoint = 'https://nft.api.infura.io/networks/{}/accounts/{}/assets/nfts'.format(chain_id,wallet_address)
    infura_key = access_secret_version(project_id,'cf_infura_key')
    infura_secret = access_secret_version(project_id,'cf_secret_id')
    response = requests.get(infura_nft_api_endpoint,auth=(infura_key,infura_secret))
    wallet_nft_data_json = response.text
    print("response: {}".format(wallet_nft_data_json))
    # Send to cloud storage bucket
    pub_url = upload_blob(bucket_name, wallet_nft_data_json, destination_blob_name, content_type)
    print("public url: {}".format(pub_url))
    return wallet_nft_data_json

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
    """Uploads data to the bucket."""
    storage_client = storage.Client.from_service_account_json('service_account.json')
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    generation_match_precondition = 0
    blob.upload_from_string(source_file_string, if_generation_match=generation_match_precondition, content_type=content_type)
    print(
        f"File uploaded to {destination_blob_name}."
    )
    pub_url = 'https://storage.googleapis.com/{}/{}'.format(bucket_name,destination_blob_name)
    return pub_url  
