#! /usr/bin/env false
#
# Set up environment for developing/running catch-apis.
# Always run this in ANY new window before doing ANYTHING!

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

### 1. Install venv and dependencies
source _venv_installation.sh

### 2. Make sure there's a .config.cfg file for flask_dashboardmonitor
if [[ ! -f .config.cfg ]]; then
  echo -e """${RED}
    =============================================================================
    No '.config.cfg' file found! Exiting set up.
    A template can be found here:
    https://flask-monitoringdashboard.readthedocs.io/en/master/configuration.html
    =============================================================================
  ${WHI}"""
  return 1
fi

### 3. Make sure there's a DB file for flask_dashboardmonitor
if [[ ! -f .dashboard.db ]]; then
  echo -e "${CYA}>>> No file '.dashboard.db' found; creating now${WHI}"
  touch .dashboard.db
fi

### 4. Link git pre-commit-hook script (.git won't exist within docker container!)
if [[ -d $PWD/.git ]]; then
  ln -fs $PWD/_precommit_hook $PWD/.git/hooks/pre-commit
fi

### 5. Check that redis dirs exist and give status of redis:
echo -e "${CYA}>>> Install and start redis if it's not already running; its status is:${WHI}"
if [[ ! -d .redis ]]; then mkdir -p .redis; fi
if [[ ! -d .redis/old-logs ]]; then mkdir -p .redis/old-logs; fi
./_redis_manager status

### 6. Ensure npm is installed and required packages are globally available
if [ $(command -v npm) ]; then
  echo -e "${CYA}>>> Checking/installing required npm packages${WHI}"
  if [ $(command -v nodemon) ]; then
    echo -e "${CYA}>>> nodemon found${WHI}"
  else
    echo -e "${CYA}>>> nodemon not found; installing:${WHI}"
    npm install -g nodemon
  fi
  if [ $(command -v pm2) ]; then
    echo -e "${CYA}>>> pm2 found${WHI}"
  else
    echo "${CYA}>>> pm2 not found; installing:${WHI}"
    npm install -g pm2
  fi
else
  echo -e "${RED}No npm found!!!${WHI}"
  return 1
fi

### 7. Ensure we have dirs for web-api logging in production
if [[ ! -d logging/old-logs ]]; then mkdir -p logging/old-logs; fi

### 8. Inject custom html into flask_restplus templates
./_customize_swagger

echo -e "${GRE}>>> Set up complete. Enjoy Flask API-ing!${WHI}"
