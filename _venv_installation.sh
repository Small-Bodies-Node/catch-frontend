#! /usr/bin/env false
#
# The first part of the initial setup that does the heavy dependency installation

clear

### 0. Load vars defined in .env
if [[ -f .env ]]; then
  source .env
else
  echo """
    ===================================
    No .env file found! Failing set up.
    Copy and edit from '.env-template'
    ===================================
  """
  return 1
fi

### 1. Print what's happening
echo -e """${CYA}
    =======================================
    Initializing Python Virtual Environment
    =======================================
${WHI}"""
sleep 1

### 2. Get rid of cached versions
rm -rf .mypy_cache
find . | grep -E "(__pycache__|\.pyc|\.pyo$)" | xargs rm -rf

### 3. Ensure existence of `.venv` dir
if [[ ! -d ./.venv ]]; then
  echo -e "${CYA}>>> Virtual Environment Not Found -- Creating './.venv'${WHI}"
  $PYTHON_3_5_OR_HIGHER -m venv .venv
  echo -e "${CYA}>>> Using python version:${WHI} $($PYTHON_3_5_OR_HIGHER -V)${WHI}"
fi

### 4. Activate VENV
echo -e "${CYA}>>> Activating virtual env...${WHI}"
source ./.venv/bin/activate

### 5. Upgrade pip
echo -e "${CYA}>>> Upgrading pip...${WHI}"
python3 -m pip install --upgrade pip setuptools wheel

### 6. Install Requirements to VENV
echo -e "${CYA}>>> Installing python packages...${WHI}"
sleep 1
python3 -m pip install -r requirements.vscode.txt
python3 -m pip install -r requirements.txt

echo -e "${GRE}>>> Installation of venv complete!${WHI}"
