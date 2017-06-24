"""
WSGI config for d3-ng2-service project.

This module contains the WSGI application used by Django's development server
and any production WSGI deployments. It should expose a module-level variable
named ``application``. Django's ``runserver`` and ``runfcgi`` commands discover
this application via the ``WSGI_APPLICATION`` setting.

Usually you will have the standard Django WSGI application here, but it also
might make sense to replace the whole Django WSGI application with a custom one
that later delegates to the Django one. For example, you could introduce WSGI
middleware here, or combine a Django application with an application of another
framework.

"""
import environ
import logging
import os
import sys
from django import db
from django.core.wsgi import get_wsgi_application


# We defer to a DJANGO_SETTINGS_MODULE already in the environment. This breaks
# if running multiple sites in the same mod_wsgi process. To fix this, use
# mod_wsgi daemon mode with each site in its own daemon process, or use
# os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings.production"
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")

# This application object is used by any WSGI server configured to use this
# file. This includes Django's development server, if the WSGI_APPLICATION
# setting points here.
application = get_wsgi_application()
env = environ.Env()
env.read_env()
log_root = env('LOG_ROOT')
if not log_root:
    sys.exit("No LOG_ROOT in environment")

logfile = os.path.join(log_root, 'wsgi.log')
log_level = logging.DEBUG
formatter = logging.Formatter("[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s")
systemlog = logging.getLogger()
systemlog.setLevel(log_level)

file_handler = logging.FileHandler(logfile)
file_handler.setFormatter(formatter)
systemlog.addHandler(file_handler)


# Apply WSGI middleware here.
# from helloworld.wsgi import HelloWorldApplication
# application = HelloWorldApplication(application)
# This is to force the database connections to close when done loading, otherwise
# it leaves one database connection per gunicorn worker
db.connections.close_all()
