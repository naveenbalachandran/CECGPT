from langchain.document_loaders import DirectoryLoader
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from gpt_new import extract_keywords
loader = DirectoryLoader('.\\docs\\', glob="**\\*.txt", loader_cls=TextLoader)
print(loader)
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)
print(docs)
embeddings = HuggingFaceEmbeddings()
docsearch = FAISS.from_documents(docs, embeddings)
def generate_grounded_prompt(query):
    keywords = extract_keywords(query)
    q2= ""
    for keyword in keywords:
        q2 +=keyword[0]
    docs = docsearch.similarity_search_with_score(q2)
    # docs = docsearch.similarity_search_with_score(query)
    docs.sort(key = lambda x: x[1], reverse=True)
    docs[:3]
    res = ""
    for doc in docs:
        res+=str(doc)
        print("==================")
        print(doc[0])
    return res+"Based on the above context answer the following question. Dont say the provided context instead use in cec. All the questions are about College of Engineering Chengannur."+query
