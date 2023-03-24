import requests
from google.cloud import storage
from google.cloud import secretmanager
from datetime import datetime
from PIL import Image, ImageEnhance
from PIL import ImageDraw
from PIL import ImageFont

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
    secret_id = 'cf_certifacate_nenerator_secret'
    secret = access_secret_version(project_id,secret_id)
    if request_json and 'secret' in request_json:
        if request_json['secret'] == secret:
            wallet_nft_data_json = get_certifactes(request_json)
            return wallet_nft_data_json
    else:
        return f'Invalid URL has been passed or incorrect JOSN input is passed'

def get_certifactes(request_json):
    """
    request_json - is a JSON object
        ex. request_json = {"secret":"$ZFgy32HEd8tKSmC3!SmE*","game_name":"test-game","token_id":"0x51dF6D1c2534C2Cb9348C4Fbd3227e704BA8cd3C","game_level":"2"}
    """
    bucket_name = 'ethdenver-ar-game-certifacates'
    # Overwrite this bucket name if needed to from HTTP Request
    if 'bucket_name' in request_json:
        bucket_name = request_json['bucket_name']   
    game_name = request_json['game_name']   
    game_level = request_json["game_level"]
    token_id = request_json["token_id"]
    game_param = {"game_name" = game_name, "game_level" = game_level, "token_id" = token_id}

    img_01 = Image.open("certifacte_background.png")

    I1 = ImageDraw.Draw(img_01)
    myFont = ImageFont.truetype('FreeMono.ttf', 65)
    I1.text((500, 250), game_name,font=myFont, fill=(255, 0, 0))
    I1.text((500, 500), "Leval:" + game_level, font=myFont, fill=(255, 0, 0))
    myFont_tk = ImageFont.truetype('FreeMono.ttf', 35)
    I1.text((200, 750), "token:" + token_id, font=myFont_tk, fill=(255, 0, 0))

    img_01.save("merged_images.jpeg", "jpeg")

    content_type = 'image/jpeg'
    destination_blob_name = token_id + '/' + str(game_name)+ str(game_level) + '/' + str(datetime.now().strftime("%Y%m%d%H%M%S%f")) + '.jpeg'
    # infura_key = access_secret_version(project_id,'cf_infura_key')
    # infura_secret = access_secret_version(project_id,'cf_secret_id')
    # response = requests.get(infura_nft_api_endpoint,auth=(infura_key,infura_secret))
    # wallet_nft_data_json = response.text
    # print("response: {}".format(wallet_nft_data_json))
    # Send to cloud storage bucket
    pub_url = upload_blob(bucket_name, img_01, destination_blob_name, content_type)
    print("public url: {}".format(pub_url))
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
