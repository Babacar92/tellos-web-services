echo "Add extensions start at $(date -u)"

psql -v ON_ERROR_STOP=1 --username="${POSTGRES_USER}" <<EOF
    CREATE SCHEMA IF NOT EXISTS ${POSTGRES_USER};
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
EOF

echo "Add extensions end at $(date -u)"
