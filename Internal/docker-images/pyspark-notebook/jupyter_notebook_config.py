from notebook.services.contents.filemanager import FileContentsManager
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def pre_save_hook(model, **kwargs):
    # Your custom pre-save action here
    # print("Performing custom pre-save action for new notebook.")
    logger.info("Performing custom pre-save action for new notebook.")

# Register the pre-save hook
# c.FileContentsManager.pre_save_hook = pre_save_hook
# c.NotebookApp.startup_script = '/home/node/.ipython/profile_default/startup/00-startup_script.py'
