import json
import os
import random
import string
import sys
import time
from urllib.parse import urlencode
import urllib.request

from colorama import Fore, Style


def get_random_string(length):
    """Generate a random string of fixed length"""
    letters = string.ascii_lowercase
    return "".join(random.choice(letters) for i in range(length))


def create_config(config_dir, chat_id):
    config_path = os.path.join(config_dir, "config.json")
    with open(config_path, "w") as config_file:
        config_file.write(json.dumps({"chatId": chat_id}))


def get_data(input_str, input_length, chat_id, config_dir):
    random_string = get_random_string(15)
    headers = {
        "Host": "chatbot.theb.ai",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "identity",
        "Content-Type": "application/json",
        "Origin": "https://chatbot.theb.ai",
        "Referer": "https://chatbot.theb.ai/",
        "Cookie": f"__cf_bm={random_string}",
    }
    data = {"prompt": input_str, "options": {"parentMessageId": chat_id}}
    data = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(
        "https://chatbot.theb.ai/api/chat-process", headers=headers, data=data
    )
    try:
        with urllib.request.urlopen(req) as response:
            resp_data = response.read()
    except Exception as e:
        print(f"\nSome error has occurred. Check your internet connection. Error: {e}")
        sys.exit(0)
    resp_str = resp_data.decode("utf-8")
    resp_list = []
    for line in resp_str.strip().split('\n'):
        data = json.loads(line)
        resp_list.append(data)

    if "id" not in resp_list[0]:
        print("Error: No connection")
        print(f"Status Code: {response.code}")
        sys.exit(0)
    chat_id = resp_list[-1]["id"]
    create_config(config_dir, chat_id)
    text = resp_list[-1]["text"]
    return text

def get_response_api(input_prompt):
    text = get_data(input_prompt, len(input_prompt), "", ".")
    return text

