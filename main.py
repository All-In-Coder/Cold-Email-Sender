from pathlib import Path
from dotenv import load_dotenv
import os
import sys
# libraries to be imported
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

env_path = Path('.', '.env')
load_dotenv(dotenv_path=env_path) 


fromaddr = os.getenv("FROM_ADDR")
password = os.getenv("PASSWORD")
Body     = open("Body.txt", "r").read()


def send_email(toaddr):
    msg = MIMEMultipart()
    msg['From'] = fromaddr
    msg['To'] = toaddr
    msg['Subject'] = os.getenv("SUBJECT")
    body = Body

    # attach the body with the msg instance
    msg.attach(MIMEText(body, 'plain'))

    # open the file to be sent
    filename = "Resume.pdf"
    filePath = os.getcwd() + '\\'+ 'uploads' + '\\' + filename
    attachment = open(filePath, "rb")

    # instance of MIMEBase and named as p
    p = MIMEBase('application', 'octet-stream')

    # To change the payload into encoded form
    p.set_payload((attachment).read())

    # encode into base64
    encoders.encode_base64(p)

    p.add_header('Content-Disposition', "attachment; filename= %s" % filename)

    # attach the instance 'p' to instance 'msg'
    msg.attach(p)

    # creates SMTP session
    s = smtplib.SMTP('smtp.gmail.com', 587)

    # start TLS for security
    s.starttls()

    # Authentication
    s.login(fromaddr, password)

    # Converts the Multipart msg into a string
    text = msg.as_string()

    # sending the mail
    s.sendmail(fromaddr, toaddr, text)
    s.quit()




TO_SEND =   sys.argv[1]
send_email(TO_SEND)