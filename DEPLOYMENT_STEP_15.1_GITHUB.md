# STEP 15.1 — Connect Project to GitHub

## Prerequisites
- Git must be installed on your system
- GitHub account created
- GitHub CLI (`gh`) installed (optional, for easier setup)

## Option 1: Using GitHub CLI (Recommended - Easiest)

If you have GitHub CLI installed:

```bash
# Initialize git (if not already done)
git init

# Create repo and push in one command
gh repo create bk-agencements --public --source=. --remote=origin --push
```

## Option 2: Manual Setup (Standard Method)

### Step 1: Initialize Git (if not already done)
```bash
git init
```

### Step 2: Create Repository on GitHub
1. Go to https://github.com/new
2. Repository name: `bk-agencements`
3. Choose Public or Private
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 3: Add Remote and Push
```bash
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/bk-agencements.git

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Luxury furniture e-commerce & interior design portfolio"

# Push to main branch
git branch -M main
git push -u origin main
```

## Option 3: Using SSH (If you have SSH keys set up)

```bash
git init
git remote add origin git@github.com:YOUR_USERNAME/bk-agencements.git
git add .
git commit -m "Initial commit: Luxury furniture e-commerce & interior design portfolio"
git branch -M main
git push -u origin main
```

## Verify Setup

After pushing, verify with:
```bash
git remote -v
git status
```

You should see:
- `origin` pointing to your GitHub repo
- Clean working tree

## Next Steps

After completing this step, proceed to:
- **STEP 15.2** - Prepare Code for Deployment

---

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username in the commands above.




