# CATCH API

## OPERATING INSTRUCTIONS

### LOCAL DEVELOPMENT

To develop this flask API locally on a linux-like machine:

1. Copy `.env-template` to `.env` and supply labels/credentials. It's recommended that you choose a local installation of python3 (viz. `which -a python3`) that is not supplied by anaconda, as that might lead to virtual-env mix ups.

2. Run `source _initial_setup.sh` in order to:

    1. Create a virtual environment 'venv' if it doesn't already exist
    2. Activate venv
    3. Update pip
    4. Install project dependencies

3. Run `sh _start_dev_api.sh` to start the flask api locally in development mode. [Nodemon](https://www.npmjs.com/package/nodemon) is used here to watch for file changes. (You'll need to install node and nodemon; if you prefer then you can just call `python src/app_entry.py` directly and restart it whenever you make changes in development.)

4. To test the routes, there is a crude `_test_routes.sh` script that prints out the reult of making local http requests to the defined routes. This will be augmented/replaced with proper end-to-end tests soon.

5. If in the course of your development you add new package dependencies, don't forget to 'freeze' your changes by running `sh _freeze_requirements.sh` while in the venv, and commit those changes.

### DEPLOY TO PRODUCTION

At the moment we're just cloning and pulling to our remote linux machine; soon we'll set up CI. To test locally script for starting up the full remote API, use `sh _start_prod_api.sh`.

## CODEBASE CONVENTIONS

The following tools/conventions are used to promote codebase quality amidst multiple developers

### File Naming

-   Scripts for working with this code base always begin '\_'.
-   All application source code is placed in the `SRC` dir
-   Configuration files are to be saved in the root dir
-   Ad hoc instruction files are to be labelled README.md, and can be placed in any dir

### Tooling

-   mypy (with vscode integration)
    -   Please add python typings to ALL aspects of the code base (all classes, functions, etc.)
-   [Black](https://www.mattlayman.com/blog/2018/python-code-black/) pre-commit hooks auto-formatting (TBD)

## GENERATING SQLALCHEMY-ORM MODELS

This only needs to be done when the DB schema gets changed. Run `_generate_models.sh` to generate an output of the latest DB schema translated into sqlalchemy-ORM syntax in `generated-models/gen-models.txt`, then we essentially copy-paste those contents into `src/models.py`

## GIT COMMITS

...

## TODOs

[] Add testing
[] Set up CI
[] Swagger docs

## DEVELOPMENT NOTES

These are misc notes where you can describe issues/decisions-taken in the course of development (especially if the motivation for sth may not be clear, etc.)

-- DWD: I tried using conda virtual environments, but my local version of conda (4.6.2) seem to have breaking changes from remote conda (4.3.30), such as the way in which you `source activate` (the newer version replaces the script `activate` with the command `conda activate`). This made it tricky to coordinate the setup pipeline. Also, using `virtualenv` seemed overall to be simpler in the end.

-- DWD: Introducing python typings into the mix broke remote since it's only supported by python >=3.5. I tried switching to the anaconda executable, but this proved incompatible with the pre-installed virtualenv. I therefore created a conda venv and installed therein (i) the latest version of python (3.7.2), and (ii) a conda-compatible virtualenv. These now have to be specified in `.env`.

-- DWD: I tried pip-installing a package `setproctitle` remotely, but it failed (probably because remote doesn't have python-dev package installed). If we get more trouble with installing packages with binary dependencies, etc. then we'll to switch over to conda environments.

-- DWD: Added `sqlalchemy-stubs` to make `mypy` comply better with models generated by `sqlacodegen`. This caused type errors to arise with the `Column` function imported from `sqlalchemy`, but I expect this will get solved at some point (since `sqlalchemy-stubs` are in early development).

-- DWD: When it came to adding swagger documentation, the main contenders (based on python entries in [this list](https://swagger.io/tools/open-source/open-source-integrations/)) seemed to be `flask_restplus`, `flassger` and `connexion`. I've gone with flask_restplus first.

-- DWD: NOTE: this codebase has '/' file separators hard-coded, e.g. in logging.ini files; that, plus the bash scripts, makes this codebase inhospitable to windows machines.

-- DWD: NOTE: the script `_initial_setup.sh` must be sourced (not sh-ed) because it exports env variables. To try to prevent sh-ing I added a 'trick' taken from [here](https://stackoverflow.com/a/47613477/8620332) to test if the script was sourced. That seemed to work but, beware, it causes Jenkins' builds to fail, so I added some optional logic to by-pass that test; just be sure to use 'source' in your Jenkins builds!

-- D1
