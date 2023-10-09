#!/bin/bash

# Install and upgrade notebook to version 6.4.12
pip install --upgrade notebook==6.4.12

# Install jupyter_contrib_nbextensions and Install Jupyter Notebook extensions
pip install jupyter_contrib_nbextensions

# Install Jupyter Notebook extensions
jupyter contrib nbextension install --user
