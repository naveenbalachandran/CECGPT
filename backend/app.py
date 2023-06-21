from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import GPTerminal as gpt
import PromptGenerator
import os
from flask_pymongo import PyMongo
app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb+srv://root:wNlSMmR1C2HkchUS@cluster0.li8db.mongodb.net/cecgpt?retryWrites=true&w=majority'
mongo = PyMongo(app)
cors = CORS(app)

chatbot_response = ''
chatbot_status = 'ready'
@app.route('/chatbot', methods=['POST'])
def chatbot():
    global chatbot_response, chatbot_status

    message = request.json['message']
    reset = request.json.get('reset', False)
    stop = request.json.get('stop', False)
    continue_generation = request.json.get('continue', False)

    if reset:
        chatbot_response = ''
        chatbot_status = 'ready'
        response = 'Chatbot reset.'
    elif stop:
        chatbot_status = 'stopped'
        response = 'Chatbot stopped.'
    elif continue_generation:
        chatbot_status = 'generating'
        response = chatbot_response
    else:
        if chatbot_status == 'stopped':
            response = chatbot_response
        else:
            # Handle user input and generate a response
            print(message)
            prompt = PromptGenerator.generate_grounded_prompt(message)
            response = gpt.get_response_api(prompt)

    time.sleep(0)
    return jsonify({'response': response})
# @app.route('/documents', methods=['GET'])
# def get_document_names():
#     destination_directory = os.path.join(os.getcwd(), 'docs')
#     document_names = []

#     if os.path.exists(destination_directory):
#         for filename in os.listdir(destination_directory):
#             if os.path.isfile(os.path.join(destination_directory, filename)):
#                 document_names.append(filename)
#     print(document_names)
#     return jsonify(document_names)
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     files = request.files.getlist('files')
#     destination_directory = os.path.join(os.getcwd(), 'docs')

#     if not os.path.exists(destination_directory):
#         os.makedirs(destination_directory)

#     for file in files:
#         file.save(os.path.join(destination_directory, file.filename))

#     return 'File uploaded successfully.'
# Route to handle dislikes
@app.route('/dislike', methods=['POST'])
def dislike():
    question = request.json.get('question')
    response = request.json.get('response')

    # Store the question and response in MongoDB
    dislikes = mongo.db.dislikes
    dislikes.insert_one({'question': question, 'response': response})

    return jsonify({'message': 'Disliked successfully'})
#Route to handle likes
@app.route('/dislikes', methods=['GET'])
def dislikes():
    dislikes_collection = mongo.db.dislikes
    dislikes = list(dislikes_collection.find({}, {"_id": 0}))
    return jsonify(dislikes)
#Route to handle likes
@app.route('/like', methods=['POST'])
def like():
    question = request.json.get('question')
    response = request.json.get('response')

    # Append the question and response to best_answers.txt
    with open('docs/best_answers.txt', 'a') as file:
        file.write(f"{question}\n")
        file.write(f"{response}\n")
        file.write('\n')

    return jsonify({'message': 'Liked successfully'})

@app.route('/admin-ans', methods=['POST'])
def admin_ans():
    question = request.json.get('question')
    modified_response = request.json.get('modifiedResponse')

    # Write the question and modified response to worst_ans.txt
    with open('docs/worst_ans.txt', 'a') as file:
        file.write(f"{question}\n")
        file.write(f"{modified_response}\n")
        file.write('\n')

    # Delete the question from MongoDB
    dislikes_collection = mongo.db.dislikes
    dislikes_collection.delete_one({"question": question})

    return jsonify({'message': 'Answer updated successfully'})

if __name__ == '__main__':
    app.run(debug=True)
