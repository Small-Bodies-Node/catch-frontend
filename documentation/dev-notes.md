# DEVELOPMENT NOTES

These are misc notes where you can describe issues/decisions-taken in the course of development (especially if the motivation for sth may not be clear, etc.)

-- DWD: I tried using conda virtual environments, but my local version of conda (4.6.2) seem to have breaking changes from remote conda (4.3.30), such as the way in which you `source activate` (the newer version replaces the script `activate` with the command `conda activate`). This made it tricky to coordinate the setup pipeline. Also, using `virtualenv` seemed overall to be simpler in the end.

-- DWD: Introducing python typings into the mix broke remote since it's only supported by python >=3.5. I tried switching to the anaconda executable, but this proved incompatible with the pre-installed virtualenv. I therefore created a conda venv and installed therein (i) the latest version of python (3.7.2), and (ii) a conda-compatible virtualenv. These now have to be specified in `.env`.

-- DWD: I tried pip-installing a package `setproctitle` remotely, but it failed (probably because remote doesn't have python-dev package installed). If we get more trouble with installing packages with binary dependencies, etc. then we'll to switch over to conda environments.

-- DWD: Added `sqlalchemy-stubs` to make `mypy` comply better with models generated by `sqlacodegen`. This caused type errors to arise with the `Column` function imported from `sqlalchemy`, but I expect this will get solved at some point (since `sqlalchemy-stubs` are in early development).

-- DWD: When it came to adding swagger documentation, the main contenders (based on python entries in [this list](https://swagger.io/tools/open-source/open-source-integrations/)) seemed to be `flask_restplus`, `flassger` and `connexion`. I've gone with `flask_restplus` first.

-- DWD: NOTE: regretfully, the decision to go with `flask_restplus` may have been a bad one since the project [seems to have been abandoned](https://github.com/noirbizarre/flask-restplus/issues/593) by its original creator :(

-- DWD: NOTE: this codebase has '/' file separators hard-coded, e.g. in logging.ini files; that, plus the bash scripts, makes this codebase inhospitable to windows machines.

-- DWD: NOTE: the script `_initial_setup` must be sourced (not sh-ed) because it exports env variables. To try to prevent sh-ing I used a 'trick' taken from [here](https://stackoverflow.com/a/47613477/8620332) to test if the script was sourced. That seemed to work but, beware, it causes Jenkins' builds to fail, so I added some optional logic to by-pass that test; just be sure to use 'source' in your Jenkins builds!

-- DWD: NOTE: there seems to be a weird edge case when using flask_restplus namescpaces whereby the description string will truncate repeated '!' symbols to a maximum of 3. This is really odd; I can't imagine why `flask_restplus` would want to do any string formatting on the description, let alone something as niche as ensuring that !!!... is limited to three chars max.

-- DWD: CORS proved tricky with `flask_restplus`; haven't been able to find a way to make all routes CORS-able; basic means of CORS-ing routes have been added to `demo_routes.py`. For routes that use [flask_restplus response marshalling](https://flask-restplus.readthedocs.io/en/stable/marshalling.html), the only way I've found is to set the header in the controller's return statement (viz. see `moving_object_search.py`).

-- DWD: Started getting error from API: "An unhandled exception occurred. Error Message: (sqlalchemy.exc.InvalidRequestError) Can't reconnect until invalid transaction is rolled back". According to this [article](https://mofanim.wordpress.com/2013/01/02/sqlalchemy-mysql-has-gone-away/), it probably has to do with session timeouts perhaps associated with the app's low traffic while in development.

-- DWD: implemented some simple plotly templates, but this was causing VSCode to overheat and I've decided to focus on doing all plotting visualizations in the frontend, so I've now now removed all vestiges

-- DWD: to get redis working, you need to choose a stable release from [https://redis.io/download](https://redis.io/download), and insert it into `.env`. As of Sept 2019, this is `REDIS_DIST='redis-5.0.5'`. The `_init_setup` script will then install it locally if it doesn't exist. The script `_redis_server` will then provide you with `install/start/stop/restart/status` options.

-- DWD: to start gunicorn from the project root acting on an app within the `src` directory, you either need to cd in/out of `src` in your `_gunicorn_manager` script or apply the flag `--chdir src` when calling gunicorn. I discovered however that the latter option messed up my restart mechanism (where I send a series of signals with the `kill` command). Not wanting to figure out what the issuse was there, I reverted to cd in/out.

-- DWD: https://flask-sse.readthedocs.io/en/latest/config.html#redis