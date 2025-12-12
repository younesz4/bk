# STEP 15.6 — Create Automated Backups

## ✅ Backup System Created

I've created a GitHub Actions workflow for automated daily backups.

## Backup Strategy

### 1. Code Backups (GitHub)

**Automatic:**
- ✅ Every commit to GitHub is a backup
- ✅ Branch protection (optional)
- ✅ Git history preserves all changes

**Branch Structure:**
```
main          → Production (protected)
staging       → Pre-production testing
dev           → Development
feature/*     → Feature branches
```

### 2. Database Backups

**Automated Daily Backups:**
- ✅ GitHub Actions workflow runs daily at 2 AM UTC
- ✅ Backs up database to GitHub Artifacts
- ✅ Retains backups for 30 days
- ✅ Can be triggered manually

**Manual Backup Script:**
See `scripts/backup-db.sh` below.

### 3. File Backups

**Code Archive:**
- ✅ Daily code backup (excluding node_modules)
- ✅ Stored as compressed tar.gz
- ✅ Includes all source code and configs

## GitHub Actions Workflow

**Location:** `.github/workflows/backup.yml`

**Features:**
- Runs daily at 2 AM UTC (3 AM Morocco time)
- Can be triggered manually
- Backs up database and code
- Stores in GitHub Artifacts (30 days retention)

**To Enable:**
1. Push workflow file to GitHub
2. Go to **Actions** tab
3. Workflow will run automatically

**Manual Trigger:**
1. Go to **Actions** → **Daily Backup**
2. Click **"Run workflow"**
3. Select branch: `main`
4. Click **"Run workflow"**

## Database Backup Scripts

### PostgreSQL Backup Script

**Create:** `scripts/backup-db.sh`

```bash
#!/bin/bash

# Database backup script for PostgreSQL
# Usage: ./scripts/backup-db.sh

set -e

BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/db-backup-$TIMESTAMP.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set"
  exit 1
fi

# Backup database
echo "Backing up database..."
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE
BACKUP_FILE="$BACKUP_FILE.gz"

echo "Backup completed: $BACKUP_FILE"
echo "Backup size: $(du -h $BACKUP_FILE | cut -f1)"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db-backup-*.sql.gz" -mtime +7 -delete

echo "Old backups cleaned up (kept last 7 days)"
```

**Make executable:**
```bash
chmod +x scripts/backup-db.sh
```

### SQLite Backup Script (Local Development)

**Create:** `scripts/backup-db-sqlite.sh`

```bash
#!/bin/bash

# Database backup script for SQLite (local development)
# Usage: ./scripts/backup-db-sqlite.sh

set -e

BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DB_FILE="prisma/dev.db"
BACKUP_FILE="$BACKUP_DIR/db-backup-$TIMESTAMP.db"

# Create backup directory
mkdir -p $BACKUP_DIR

# Check if database file exists
if [ ! -f "$DB_FILE" ]; then
  echo "Error: Database file not found: $DB_FILE"
  exit 1
fi

# Backup database
echo "Backing up database..."
cp $DB_FILE $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE
BACKUP_FILE="$BACKUP_FILE.gz"

echo "Backup completed: $BACKUP_FILE"
echo "Backup size: $(du -h $BACKUP_FILE | cut -f1)"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db-backup-*.db.gz" -mtime +7 -delete

echo "Old backups cleaned up (kept last 7 days)"
```

## Manual Backup Commands

### Database Backup (PostgreSQL)

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Create backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Compress
gzip backup-$(date +%Y%m%d).sql
```

### Database Backup (PlanetScale/MySQL)

```bash
# Using mysqldump
mysqldump -h host -u user -p database > backup-$(date +%Y%m%d).sql
gzip backup-$(date +%Y%m%d).sql
```

### Code Backup

```bash
# Create code archive
tar -czf code-backup-$(date +%Y%m%d).tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='backups' \
  .
```

## Restore from Backup

### Restore Database (PostgreSQL)

```bash
# Uncompress if needed
gunzip backup-20240101.sql.gz

# Restore
psql $DATABASE_URL < backup-20240101.sql
```

### Restore Database (SQLite)

```bash
# Uncompress if needed
gunzip backup-20240101.db.gz

# Restore
cp backup-20240101.db prisma/dev.db
```

## Backup Storage Options

### Option 1: GitHub Artifacts (Current)
- ✅ Free (included with GitHub)
- ✅ 30 days retention
- ✅ Easy access
- ⚠️ Limited to 10GB total

### Option 2: GitHub Releases
- ✅ Permanent storage
- ✅ Versioned backups
- ✅ Downloadable
- ⚠️ Public (unless private repo)

### Option 3: Cloud Storage (Recommended for Production)

**AWS S3:**
```bash
# Install AWS CLI
aws s3 cp backup.sql.gz s3://your-bucket/backups/
```

**Google Cloud Storage:**
```bash
# Install gsutil
gsutil cp backup.sql.gz gs://your-bucket/backups/
```

**Backblaze B2:**
```bash
# Install b2 CLI
b2 upload-file your-bucket backup.sql.gz backups/
```

## Automated Backup Schedule

**Current Setup:**
- **Frequency:** Daily at 2 AM UTC
- **Retention:** 30 days (GitHub Artifacts)
- **Manual Trigger:** Available

**Recommended for Production:**
- **Daily backups:** Keep 7 days
- **Weekly backups:** Keep 4 weeks
- **Monthly backups:** Keep 12 months

## Backup Checklist

### Daily
- [x] Automated GitHub Actions backup
- [ ] Verify backup completed successfully
- [ ] Check backup size (should be consistent)

### Weekly
- [ ] Test restore from backup
- [ ] Verify backup integrity
- [ ] Check storage usage

### Monthly
- [ ] Review backup strategy
- [ ] Test disaster recovery
- [ ] Archive old backups to long-term storage

## Disaster Recovery Plan

### 1. Code Recovery
```bash
# Clone from GitHub
git clone https://github.com/yourusername/bk-agencements.git
cd bk-agencements
npm install
```

### 2. Database Recovery
```bash
# Restore from backup
psql $DATABASE_URL < backups/db-backup-YYYYMMDD.sql
```

### 3. Environment Recovery
- Restore environment variables from Vercel dashboard
- Or from secure password manager (1Password, LastPass)

### 4. Full Site Recovery
1. Restore code from GitHub
2. Restore database from backup
3. Restore environment variables
4. Redeploy to Vercel
5. Verify all functionality

## Backup Monitoring

**Set up alerts:**
1. GitHub Actions can send email on failure
2. Use GitHub Actions status badges
3. Monitor backup sizes (unusual changes = issue)

**Check backup status:**
- Go to **Actions** → **Daily Backup**
- Check latest run status
- Download artifacts if needed

## Best Practices

1. **Test Restores Regularly** - Monthly at minimum
2. **Multiple Backup Locations** - Don't rely on one source
3. **Encrypt Backups** - Especially if storing in cloud
4. **Document Recovery Process** - Write down steps
5. **Monitor Backup Success** - Set up alerts
6. **Version Control** - Use Git for code (already done)
7. **Automate Everything** - Reduce human error

---

**Next Step:** STEP 15.7 - Monitoring + Error Alerts




