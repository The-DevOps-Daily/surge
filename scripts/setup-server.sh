#!/bin/bash
# Initial server setup for Surge
# Run this on a fresh DigitalOcean droplet (Ubuntu 24.04)

set -e

echo "=== Surge - Server Setup ==="

# Install Docker
if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi

# Install Docker Compose plugin
if ! docker compose version &> /dev/null; then
  echo "Installing Docker Compose..."
  apt-get update
  apt-get install -y docker-compose-plugin
fi

# Create app directory
mkdir -p /opt/surge
cd /opt/surge

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << 'ENVEOF'
POSTGRES_PASSWORD=CHANGE_ME_TO_RANDOM_STRING
NEXTAUTH_SECRET=CHANGE_ME_TO_RANDOM_STRING
NEXTAUTH_URL=https://yourdomain.com
REGISTRATION_ENABLED=true

# Stripe (add when ready)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRO_PRICE_ID=
STRIPE_FAMILY_PRICE_ID=

# Email — smtpfa.st (add when ready)
SMTPFAST_API_KEY=
SMTPFAST_API_URL=https://smtpfa.st
SMTPFAST_FROM_EMAIL=

# Analytics (add when ready)
NEXT_PUBLIC_ANALYTICS_ID=
ENVEOF

  echo ""
  echo "IMPORTANT: Edit /opt/surge/.env and set:"
  echo "  - POSTGRES_PASSWORD (random string)"
  echo "  - NEXTAUTH_SECRET (random string)"
  echo "  - NEXTAUTH_URL (your domain)"
  echo ""
  echo "Generate random strings with: openssl rand -hex 32"
fi

echo ""
echo "=== Setup complete! ==="
echo ""
echo "Next steps:"
echo "1. Edit .env with your values"
echo "2. Copy docker-compose.prod.yml and nginx.conf to /opt/networth-tracker/"
echo "3. Run: docker compose -f docker-compose.prod.yml up -d"
echo "4. Set REGISTRATION_ENABLED=true, create your account, then set it to false"
echo ""
echo "For SSL (after DNS is pointed):"
echo "  docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d yourdomain.com"
echo "  Then uncomment the SSL server block in nginx.conf and restart nginx"
