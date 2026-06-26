# Matcha Aquatics

Matcha Aquatics is a modern e-catalog application designed to provide an efficient and interactive shopping experience for aquatic equipment.

## Key Features

The application is equipped with various third-party integrations to support a complete e-commerce workflow:

-   **Payments:** Full integration with the [Midtrans](https://midtrans.com/) API for secure online payment processing.
-   **Logistics:** Integration with the [RajaOngkir](https://rajaongkir.com/) API for automated shipping cost calculations.
-   **Authentication:** Seamless user access via Google OAuth2.
-   **Interface:** A modern, responsive design built with React.js, Tailwind CSS, and [shadcn/ui](https://ui.shadcn.com/) components.

## Technology Stack

-   **Backend:** Laravel 12
-   **Frontend:** React.js, TypeScript, Tailwind CSS
-   **UI Components:** shadcn/ui
-   **Database:** SQLite / MySQL

## Prerequisites

Ensure your environment meets the following requirements:
-   PHP >= 8.2
-   Composer
-   Node.js & NPM
-   (Optional) Laravel Sail for containerized development

## Setup & Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/GforsZi/Matcha_Aquatics.git
    cd Matcha_Aquatics
    ```

2.  Install PHP and JS dependencies:
    ```bash
    composer install
    npm install
    ```

3.  Configure the environment:
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4.  API Configuration:
    Update your `.env` file with the necessary credentials for Midtrans, RajaOngkir, and Google OAuth2.

5.  Run the application:
    ```bash
    composer dev
    ```

## Important Note: Midtrans Webhook Integration

During local development, this application requires a public-facing URL to receive webhook notifications from Midtrans. We recommend using **ngrok** to tunnel your local server:

```bash
ngrok http 8000
```

Once running, update your Midtrans dashboard with the provided ngrok URL as the webhook notification endpoint.
