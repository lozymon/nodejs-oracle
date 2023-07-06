ALTER session SET container=XEPDB1;
CREATE USER dev_user IDENTIFIED BY dev2023;
ALTER USER dev_user DEFAULT TABLESPACE users QUOTA UNLIMITED ON users;
ALTER USER dev_user TEMPORARY TABLESPACE temp;
GRANT create session, create table, create procedure, create sequence, create trigger , create view, create synonym, alter session TO dev_user;
grant select, insert, update, delete on SYS.V_$SESSION to dev_user;
grant create synonym to dev_user;