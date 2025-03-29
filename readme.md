# Scraping Shopee Grab Food API

This project is a Node.js-based web scraping API that extracts menu data from food delivery platforms like Grab and Shopee Food. It uses Puppeteer for web scraping and Express.js for building the API.

## Features

- **Web Scraping**: Extracts menu items, including title, description, price, old price, and image, from Grab and Shopee Food.
- **REST API**: Provides endpoints to trigger scraping and retrieve data.
- **Error Handling**: Centralized error handling middleware.
- **Dockerized**: Includes Docker support for both the API and an Nginx reverse proxy.
- **SSL Support**: Configured to use [Certbot](https://certbot.eff.org) for free SSL certificates.

## Usage Examples

### Health Check
**Endpoint**: `GET /`

**Example Request**:
```bash
curl http://localhost:4000/
```

**Example Response**:
```json
{
  "status": "running"
}
```

---

### Crawl Menu Items
**Endpoint**: `GET /api/v1/crawls`

**Query Parameters**:
- `url` (string): The URL of the page to scrape.
- `type` (string): The type of platform (`grab` or `shopee`).

**Example Request**:
```bash
curl "http://localhost:4000/api/v1/crawls?url=https://example.com/menu&type=grab"
```

**Example Response**:
```json
{
  "message": "Send request successfully",
  "data": [
    {
      "title": "Item Name",
      "description": "Item Description",
      "price": "100,000",
      "oldPrice": "120,000",
      "image": "https://example.com/image.jpg"
    }
  ],
  "statusCode": 200,
  "total": 1
}
```

---

## Setup Instructions

### Prerequisites

- Node.js (v20 or later)
- Docker and Docker Compose
- Certbot (for SSL)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lehuuhieuak/scraping-shopee-grab-food
   cd scraping-shopee-grab-food
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `PORT` variable in `.env` as needed.

### Running Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Access the API at `http://localhost:<PORT>`.

### Running with Docker

1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

2. Access the API at `https://<your-domain>:1443`.

---

## License

This project is licensed under the ISC License.

## Acknowledgments

- [Puppeteer](https://pptr.dev) for web scraping.
- [Express.js](https://expressjs.com) for building the API.
- [Certbot](https://certbot.eff.org) for SSL certificates.