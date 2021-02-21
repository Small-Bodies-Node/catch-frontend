FROM centos:centos7
### SIZE-CHECK: 204MB

#########################################################################################
# Install stuff available on your target server
# NOTES:
# - Check package is installed on target server: yum list installed | grep XXX
# - Installing yum packages in one RUN command greatly reduces image size by minimizing cache layers
#########################################################################################

RUN yum update -y

RUN yum-config-manager --enable pgdg12
RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash -

RUN yum install -y \
  # General stuff useful for operating linux
  which \
  file \
  git \
  man  \
  yum-utils \
  make\
  gcc\
  gcc-c++\
  libgcc \
  ncurses \
  ncurses-devel \
  kernel \
  kernel-devel \
  kernel-headers \
  kernel-tools \
  kernel-tools-libs \
  net-tools \
  ### SIZE-CHECK: 1.12GB
  ### Python stuff
  python3.x86_64 \
  python3-devel.x86_64 \
  python3-libs.x86_64 \
  python3-pip.noarch \
  python3-rpm-generators.noarch \
  python3-rpm-macros.noarch \
  python3-setuptools.noarch \
  rpm-python.x86_64 \
  python-devel.x86_64 \
  python-libs.x86_64 \
  ### Node stuff: https://linuxize.com/post/how-to-install-node-js-on-centos-7/
  nodejs \
  ### Stuff needed for building vim, tmux and zsh
  openssl.x86_64 \
  openssl-devel.x86_64 \
  openssl-libs.x86_64 \
  xterm.x86_64 \
  libX11.x86_64 \
  libX11-common.noarch \
  libX11-devel.x86_64 \
  libXt.x86_64 \
  libXt-devel.x86_64 \
  libXtst.x86_64 \
  libXtst-devel.x86_64 \
  zsh.x86_64 \
  libevent.x86_64 \
  vim-X11.x86_64 \
  vim-common.x86_64 \
  vim-enhanced.x86_64 \
  vim-filesystem.x86_64 \
  vim-minimal.x86_64 \
  # Add facilities to give non-root user sudo permissions
  passwd \
  sudo

### Upgrade node/npm to v12/v6; install pm2 and nodemon globally:
# RUN npm install n -g && n 12 && npm --version && node --version && npm i -g nodemon pm2
RUN npm --version && node --version && npm i -g nodemon pm2


# Create postgres user with sudo permissions
# Note: doing everything as a user named 'postgres' is for simplicity in development
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
RUN adduser postgres
RUN groupadd sudo
RUN usermod -aG sudo postgres

# Setup 'myconfig' for better shell experience for root and postgres user
# NOTES:
# - We install zsh, tmux, vim because native centos7 versions suck
# - See here for details on 'myconfig' : https://github.com/d-w-d/myconfig
# - Set this up BEFORE setting up postgres to make debugging easier within live container
RUN bash -c 'cd $HOME; pwd'
RUN bash -c 'source <(curl -L https://raw.githubusercontent.com/dan-drago/myconfig/master/tmp_install.sh)'
RUN bash -c 'source /tmp/myconfig/perm_install.sh'
RUN bash -c 'source /root/.myconfig/entry.sh && /root/.myconfig/RHEL/.bin/myconfig_install_tmux'
RUN bash -c 'source /root/.myconfig/entry.sh && /root/.myconfig/RHEL/.bin/myconfig_install_vim'
RUN bash -c 'source /root/.myconfig/entry.sh && /root/.myconfig/RHEL/.bin/myconfig_install_zsh'
RUN bash -c 'rm -rf /tmp/*'
USER postgres
RUN bash -c 'cd $HOME'
RUN bash -c 'source <(curl -L https://raw.githubusercontent.com/dan-drago/myconfig/master/tmp_install.sh)'
RUN bash -c 'source /tmp/myconfig/perm_install.sh'
RUN bash -c 'source /home/postgres/.myconfig/entry.sh && /home/postgres/.myconfig/RHEL/.bin/myconfig_install_tmux'
RUN bash -c 'source /home/postgres/.myconfig/entry.sh && /home/postgres/.myconfig/RHEL/.bin/myconfig_install_vim'
RUN bash -c 'source /home/postgres/.myconfig/entry.sh && /home/postgres/.myconfig/RHEL/.bin/myconfig_install_zsh'

# Install postgres v12 following these instructions: https://computingforgeeks.com/how-to-install-postgresql-12-on-centos-7/
USER root
RUN yum install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm \
  epel-release \
  yum-utils
RUN yum-config-manager --enable pgdg12
RUN yum -y install postgresql12-server \
  postgresql12 \
  # Install postgis v2.5.12; note: not sure exactly what patch version of postgresql is used on target server; gone with 12
  postgis25_12

# Create a dir for pg-data; give postgres ownership
RUN mkdir -p /usr/local/pgsql/data && chown postgres:postgres /usr/local/pgsql/data

################################################################################
# Switch to postgres user and set up DB
#
# Notes:
# The commands below for initiating/starting the DB are taken from the script+arg: `/usr/pgsql-12/bin/postgresql-12-setup initdb`
# Specifically, the line that reads: `$SU -l postgres -c "$initdbcmd" >> "$PGLOG" 2>&1 < /dev/null`
# This initiation will both create the data dir and begin the daemon; the command cashes out to the following:
# /usr/pgsql-12/bin/initdb --pgdata='/usr/local/pgsql/data' --auth='ident'
# Note: to start/stop/restart the daemon, use: `/usr/pgsql-12/bin/pg_ctl -D /usr/local/pgsql/data start`, etc.
# Note: each RUN command is like a script; at its end, all subprocesses will be killed, so
#         you need to leave it running and us && to carry out operations on runnin g daemon
################################################################################
USER postgres
# This backup file is from live prod db using: `pg_dump -Fc -b -v -f "catch-surveys.backup" surveys`
COPY catch-surveys-20201201.backup /tmp/catch-surveys-20201201.backup
# Initiate data dir and start daemon (though daemon is killed instantly at end of RUN)
RUN /usr/pgsql-12/bin/initdb --pgdata='/usr/local/pgsql/data' --auth='ident'
# Start daemon and carry out operations specific to catch:
RUN /usr/pgsql-12/bin/pg_ctl -D /usr/local/pgsql/data start \
  && createdb surveys_dev \
  && psql surveys_dev -c "CREATE EXTENSION postgis;" \
  && psql surveys_dev -c "GRANT INSERT ON public.spatial_ref_sys TO postgres" \
  # && psql surveys_dev -c "GRANT ALL PRIVILEGES ON public.spatial_ref_sys TO postgres" \
  && psql surveys_dev -c "GRANT ALL PRIVILEGES ON DATABASE surveys_dev TO postgres" \
  && psql surveys_dev -c "INSERT INTO public.spatial_ref_sys VALUES( 40001, 'SBSearch', 1, 'GEOGCS[\"Normal Sphere (r=6370997)\",DATUM[\"unknown\",SPHEROID[\"sphere\",6370997,0]],PRIMEM[\"Greenwich\",0],UNIT[\"degree\",0.0174532925199433]]', '+proj=longlat +ellps=sphere +no_defs' );" \
  # Restore backup file to new DB
  # NOTES:
  # - This step takes several minutes to parse the backup file and inject into DB
  # - The pg_restore command will incur errors; my googling on the matter suggests that they can be ignored
  # - By default, pg_restore will continue despite errors, but will return 1 at end
  # - To prevent `docker build` failing due to pg_restore returning 1, I'm using the old `... || echo ""` trick
  && pg_restore --no-privileges --no-owner -v -d surveys_dev /tmp/catch-surveys-20201201.backup || echo "Skipping pg_restore errors" \
  && /usr/pgsql-12/bin/pg_ctl -D /usr/local/pgsql/data stop

### Upgrade global pip
RUN sudo python3 -m pip install --upgrade pip setuptools wheel

RUN echo "Change me to rebuild from here !"

### Change to bash as default shell
SHELL ["/bin/bash", "-c"]

WORKDIR /app

RUN sudo chown -R postgres:postgres /app

RUN echo "Change me to rebuild from here"
COPY ./_venv_installation.sh /app/
COPY ./.env /app/
COPY ./requirements* /app/
COPY ./_redis_manager /app/




RUN cd /app \
  && source _venv_installation.sh \
  && ./_redis_manager install

# Create default command on docker-container startup
CMD ["/usr/pgsql-12/bin/pg_ctl","-D","/usr/local/pgsql/data start"]