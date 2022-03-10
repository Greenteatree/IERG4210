"""
WSGI config for ierg4210 project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os


from os.path import join,dirname,abspath
from django.core.wsgi import get_wsgi_application
#PROJECT_DIR = dirname(dirname(abspath(__file__)))#3
PROJECT_DIR = dirname(dirname(abspath(__file__)))
#import sys # 4
import sys


#sys.path.insert(0,PROJECT_DIR) # 5
sys.path.insert(0, PROJECT_DIR)
 
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ierg4210.settings')

application = get_wsgi_application()

