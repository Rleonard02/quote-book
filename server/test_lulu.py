import os
from dotenv import load_dotenv
from luluapi import LuluApiClient, SANDBOX_BASE_URL

# Load env variables from .env
load_dotenv()

client_key = os.getenv("LULU_CLIENT_ID")
client_secret = os.getenv("LULU_CLIENT_SECRET")

if not client_key or not client_secret:
    raise ValueError("Lulu API credentials missing in .env")

# Initialize Lulu API client
apiclient = LuluApiClient(
    client_key=client_key,
    client_secret=client_secret,
    base_url=SANDBOX_BASE_URL
)

assert apiclient.bearer_token, "ERROR: bearer_token missing."

# Book to print
book = {
    "external_id": "test-line-item",
    "title": "My Book",
    "cover_source_url": "https://dl.dropboxusercontent.com/scl/fi/tatj7p0c696xajz83a18f/Front-Spine-Back-Spread-Halloween-FINAL.pdf",
    "interior_source_url": "https://dl.dropboxusercontent.com/scl/fi/ck9d863hdphimh91jyqew/MANUSCRIPTHALLOWEEN.pdf",
    "pod_package_id": "0550X0850BWSTDPB060UW444GXX",
    "quantity": 0,
}

books = [book]

# Shipping address
address = {
    "name": "Hans Dampf",
    "street1": "Street address 1",
    "street2": "",
    "city": "Lübeck",
    "postcode": "PO1 3AX",
    "state_code": "",
    "country_code": "GB",
    "phone_number": "844-212-0689",
}

# Create a print job
response = apiclient.create_print_job(address, books, shipping_level="GROUND", external_id="test-print-job")
print("Print Job Response:", response)

# List all print jobs
jobs = apiclient.get_print_jobs()
print("All Print Jobs:", jobs)
