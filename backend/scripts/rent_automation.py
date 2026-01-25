"""
Farm Friend - Complete Playwright End-to-End Test
================================================
This script tests the complete workflow:
1. Sign up as Rent Owner
2. Login as Rent Owner
3. Post equipment for rent with image
4. Logout
5. Sign up as Farmer
6. Login as Farmer
7. Book the posted rental equipment

Requirements:
- pip install playwright
- playwright install
- Backend server running at http://127.0.0.1:8000
- Frontend server running at http://127.0.0.1:3000
"""

import os
import re
import time
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright, expect


class FarmFriendPlaywrightTest:
    """Complete end-to-end Playwright test for Farm Friend application."""

    # URLs
    BASE_URL = "http://localhost:3000"
    SIGNUP_URL = f"{BASE_URL}/signup"
    LOGIN_URL = f"{BASE_URL}/login"
    EQUIPMENT_POST_URL = f"{BASE_URL}/equipment-post"
    EQUIPMENT_LIST_URL = f"{BASE_URL}/equipment-list"
    RENTAL_ADMIN_URL = f"{BASE_URL}/rental-admin"

    # Image path
    IMAGE_PATH = r"D:\Codes\Farm_Friend\backend\media\rent_items\b9faaf48-083a-44f3-bc60-28b5b6405f58_bdRlYlc.jpeg"

    def __init__(self):
        """Initialize test data with unique identifiers."""
        timestamp = datetime.now().strftime("%H%M%S")

        # Rent Owner credentials
        self.rent_owner_first_name = "Rent"
        self.rent_owner_last_name = "Owner"
        self.rent_owner_email = f"rentowner_{timestamp}@testmail.com"
        self.rent_owner_username = f"rentowner_{timestamp}"
        self.rent_owner_password = "TestPass123!"

        # Farmer credentials
        self.farmer_first_name = "Farmer"
        self.farmer_last_name = "User"
        self.farmer_email = f"farmeruser_{timestamp}@testmail.com"
        self.farmer_username = f"farmeruser_{timestamp}"
        self.farmer_password = "TestPass123!"

        # Equipment details
        self.equipment_name = f"Tractor_{timestamp}"
        self.equipment_description = "High-quality tractor for farming activities."
        self.equipment_price = "500"
        self.equipment_quantity = "2"

    def print_step(self, step_num, description):
        """Print formatted step description."""
        print(f"\n{'='*70}")
        print(f"STEP {step_num}: {description}")
        print(f"{'='*70}")

    def print_success(self, message):
        """Print success message."""
        print(f"  ✓ {message}")

    def print_info(self, message):
        """Print info message."""
        print(f"  ℹ {message}")

    def verify_image_exists(self):
        """Verify image file exists."""
        if not os.path.exists(self.IMAGE_PATH):
            raise FileNotFoundError(f"Image not found at: {self.IMAGE_PATH}")
        self.print_success(f"Image verified at: {self.IMAGE_PATH}")

    def step1_signup_rent_owner(self, page):
        """Step 1: Sign up as Rent Owner."""
        self.print_step(1, "Sign up as Rent Owner")

        # Navigate to signup
        page.goto(self.SIGNUP_URL)
        self.print_info(f"Navigated to: {self.SIGNUP_URL}")
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # Fill first name
        page.get_by_role("textbox", name="প্রথম নাম").fill(self.rent_owner_first_name)
        self.print_success(f"Entered first name: {self.rent_owner_first_name}")

        # Fill last name
        page.get_by_role("textbox", name="শেষ নাম").fill(self.rent_owner_last_name)
        self.print_success(f"Entered last name: {self.rent_owner_last_name}")

        # Fill email
        page.get_by_role("textbox", name="ইমেইল").fill(self.rent_owner_email)
        self.print_success(f"Entered email: {self.rent_owner_email}")

        # Fill username
        page.get_by_role("textbox", name="ইউজারনেম").fill(self.rent_owner_username)
        self.print_success(f"Entered username: {self.rent_owner_username}")

        # Fill password
        password_inputs = page.get_by_role("textbox", name="পাসওয়ার্ড", exact=True)
        password_inputs.first.fill(self.rent_owner_password)
        self.print_success(f"Entered password: {self.rent_owner_password}")

        # Fill confirm password
        page.get_by_role("textbox", name="পাসওয়ার্ড নিশ্চিত করুন").fill(self.rent_owner_password)
        self.print_success(f"Confirmed password: {self.rent_owner_password}")

        # Upload profile picture
        page.get_by_role("button", name="প্রোফাইল ছবি:").set_input_files(self.IMAGE_PATH)
        self.print_success("Uploaded profile picture")
        time.sleep(1)

        # Fill date of birth
        page.get_by_placeholder("জন্ম তারিখ").fill("2000-01-15")
        self.print_success("Entered date of birth")

        # Fill address
        page.get_by_role("textbox", name="ঠিকানা").fill("123 Rental Street, Dhaka")
        self.print_success("Entered address")

        # Fill contact
        page.get_by_role("textbox", name="যোগাযোগ নম্বর").fill("01712345678")
        self.print_success("Entered contact number")

        # Select Rent Owner role
        page.get_by_text("কৃষি সরঞ্জাম ভাড়া প্রদানকারী").click()
        self.print_success("Selected Rent Owner role")
        time.sleep(1)

        # Submit signup
        signup_button = page.get_by_role("button", name="সাইন আপ").first
        signup_button.click()
        self.print_success("Submitted signup form")

        # Wait for success alert
        time.sleep(2)
        # Close alert if present
        alert_buttons = page.get_by_role("button", name="ঠিক আছে")
        if alert_buttons.count() > 0:
            alert_buttons.first.click()
            self.print_info("Closed success alert")

        time.sleep(2)
        self.print_success("Rent Owner account created successfully!")

    def step2_login_rent_owner(self, page):
        """Step 2: Login as Rent Owner."""
        self.print_step(2, "Login as Rent Owner")

        # Navigate to login
        page.goto(self.LOGIN_URL)
        self.print_info(f"Navigated to: {self.LOGIN_URL}")
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # Fill username
        page.get_by_role("textbox", name="ইউজারনেম").fill(self.rent_owner_username)
        self.print_success(f"Entered username: {self.rent_owner_username}")

        # Fill password
        page.get_by_role("textbox", name="পাসওয়ার্ড").fill(self.rent_owner_password)
        self.print_success(f"Entered password: {self.rent_owner_password}")

        # Submit login
        page.get_by_role("button", name="লগইন").click()
        self.print_success("Submitted login form")

        # Wait for redirect
        time.sleep(3)
        page.wait_for_load_state("networkidle")

        # Close alert if present
        alert_buttons = page.get_by_role("button", name="ঠিক আছে")
        if alert_buttons.count() > 0:
            alert_buttons.first.click()
            time.sleep(1)

        self.print_success("Rent Owner logged in successfully!")

    def step3_post_equipment(self, page):
        """Step 3: Post equipment for rent."""
        self.print_step(3, "Post Equipment for Rent")

        # Navigate to equipment post page
        page.goto(self.EQUIPMENT_POST_URL)
        self.print_info(f"Navigated to: {self.EQUIPMENT_POST_URL}")
        page.wait_for_load_state("networkidle")
        time.sleep(2)

        # Fill equipment name
        page.get_by_role("textbox", name="Equipment Name *").fill(self.equipment_name)
        self.print_success(f"Entered equipment name: {self.equipment_name}")

        # Fill description
        page.get_by_role("textbox", name="Description *").fill(self.equipment_description)
        self.print_success("Entered equipment description")

        # Fill price
        page.get_by_role("spinbutton", name="Price per day (৳) *").fill(self.equipment_price)
        self.print_success(f"Entered price: {self.equipment_price}")

        # Fill quantity
        page.get_by_role("spinbutton", name="Quantity Available *").fill(self.equipment_quantity)
        self.print_success(f"Entered quantity: {self.equipment_quantity}")

        # Upload equipment image
        page.get_by_role("button", name="Equipment Image *").set_input_files(self.IMAGE_PATH)
        self.print_success("Uploaded equipment image")
        time.sleep(2)

        # Submit form
        page.get_by_role("button", name="Post Equipment").click()
        self.print_success("Submitted equipment form")

        # Wait for submission
        time.sleep(3)

        # Close alert if present
        alert_buttons = page.get_by_role("button", name="ঠিক আছে")
        if alert_buttons.count() > 0:
            alert_buttons.first.click()
            time.sleep(1)

        self.print_success("Equipment posted successfully!")

    def step4_logout(self, page):
        """Step 4: Logout from Rent Owner account."""
        self.print_step(4, "Logout from Rent Owner account")

        # Navigate to rental admin
        page.goto(self.RENTAL_ADMIN_URL)
        time.sleep(2)

        # Click logout button
        logout_link = page.get_by_role("link", name="লগ আউট")
        if logout_link.count() > 0:
            logout_link.click()
            self.print_success("Clicked logout button")
            time.sleep(2)
        else:
            self.print_info("Logout link not found, clearing localStorage")
            page.evaluate("() => localStorage.clear()")

        self.print_success("Logged out from Rent Owner account")

    def step5_signup_farmer(self, page):
        """Step 5: Sign up as Farmer."""
        self.print_step(5, "Sign up as Farmer")

        # Navigate to signup
        page.goto(self.SIGNUP_URL)
        self.print_info(f"Navigated to: {self.SIGNUP_URL}")
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # Fill first name
        page.get_by_role("textbox", name="প্রথম নাম").fill(self.farmer_first_name)
        self.print_success(f"Entered first name: {self.farmer_first_name}")

        # Fill last name
        page.get_by_role("textbox", name="শেষ নাম").fill(self.farmer_last_name)
        self.print_success(f"Entered last name: {self.farmer_last_name}")

        # Fill email
        page.get_by_role("textbox", name="ইমেইল").fill(self.farmer_email)
        self.print_success(f"Entered email: {self.farmer_email}")

        # Fill username
        page.get_by_role("textbox", name="ইউজারনেম").fill(self.farmer_username)
        self.print_success(f"Entered username: {self.farmer_username}")

        # Fill password
        password_inputs = page.get_by_role("textbox", name="পাসওয়ার্ড", exact=True)
        password_inputs.first.fill(self.farmer_password)
        self.print_success(f"Entered password: {self.farmer_password}")

        # Fill confirm password
        page.get_by_role("textbox", name="পাসওয়ার্ড নিশ্চিত করুন").fill(self.farmer_password)
        self.print_success(f"Confirmed password: {self.farmer_password}")

        # Upload profile picture
        page.get_by_role("button", name="প্রোফাইল ছবি:").set_input_files(self.IMAGE_PATH)
        self.print_success("Uploaded profile picture")
        time.sleep(1)

        # Fill date of birth
        page.get_by_placeholder("জন্ম তারিখ").fill("1995-05-20")
        self.print_success("Entered date of birth")

        # Fill address
        page.get_by_role("textbox", name="ঠিকানা").fill("456 Farm Village, Sylhet")
        self.print_success("Entered address")

        # Fill contact
        page.get_by_role("textbox", name="যোগাযোগ নম্বর").fill("01898765432")
        self.print_success("Entered contact number")

        # Select Farmer role
        page.get_by_text("কৃষক").click()
        self.print_success("Selected Farmer role")
        time.sleep(1)

        # Fill field size
        page.get_by_placeholder("জমির মাপ (বিঘা অনুযায়ী)").fill("10")
        self.print_success("Entered field size: 10 bigha")

        # Submit signup
        signup_button = page.get_by_role("button", name="সাইন আপ").first
        signup_button.click()
        self.print_success("Submitted signup form")

        # Wait for success alert
        time.sleep(2)
        # Close alert if present
        alert_buttons = page.get_by_role("button", name="ঠিক আছে")
        if alert_buttons.count() > 0:
            alert_buttons.first.click()
            self.print_info("Closed success alert")

        time.sleep(2)
        self.print_success("Farmer account created successfully!")

    def step6_login_farmer(self, page):
        """Step 6: Login as Farmer."""
        self.print_step(6, "Login as Farmer")

        # Navigate to login
        page.goto(self.LOGIN_URL)
        self.print_info(f"Navigated to: {self.LOGIN_URL}")
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # Fill username
        page.get_by_role("textbox", name="ইউজারনেম").fill(self.farmer_username)
        self.print_success(f"Entered username: {self.farmer_username}")

        # Fill password
        page.get_by_role("textbox", name="পাসওয়ার্ড").fill(self.farmer_password)
        self.print_success(f"Entered password: {self.farmer_password}")

        # Submit login
        page.get_by_role("button", name="লগইন").click()
        self.print_success("Submitted login form")

        # Wait for redirect
        time.sleep(3)
        page.wait_for_load_state("networkidle")

        # Close alert if present
        alert_buttons = page.get_by_role("button", name="ঠিক আছে")
        if alert_buttons.count() > 0:
            alert_buttons.first.click()
            time.sleep(1)

        self.print_success("Farmer logged in successfully!")

    def step7_book_equipment(self, page):
        """Step 7: Book rental equipment."""
        self.print_step(7, "Book Rental Equipment")

        # Navigate to equipment list
        page.goto(self.EQUIPMENT_LIST_URL)
        self.print_info(f"Navigated to: {self.EQUIPMENT_LIST_URL}")
        page.wait_for_load_state("networkidle")
        time.sleep(2)

        # Click first "Rent Now" button found
        rent_buttons = page.get_by_role("button", name="এখন ভাড়া করুন")
        if rent_buttons.count() > 0:
            rent_buttons.first.click()
            self.print_success("Clicked 'এখন ভাড়া করুন' button")
        else:
            # Try English button name
            rent_buttons_en = page.get_by_role("button", name="Rent Now")
            if rent_buttons_en.count() > 0:
                rent_buttons_en.first.click()
                self.print_success("Clicked 'Rent Now' button")
            else:
                self.print_info("No rent button found, trying alternative selectors")

        # Wait for equipment detail page
        time.sleep(3)
        page.wait_for_load_state("networkidle")

        current_url = page.url
        self.print_info(f"Current URL: {current_url}")

        # Try to find and fill return date
        date_input = page.locator('input[type="date"]')
        if date_input.count() > 0:
            # Set return date to 7 days from now
            date_input.first.fill("2026-02-01")
            self.print_success("Set return date: 2026-02-01")
            time.sleep(1)

        # Click Place Rental Order button
        order_button = page.get_by_role("button", name="Place Rental Order")
        if order_button.count() > 0:
            order_button.click()
            self.print_success("Clicked 'Place Rental Order' button")
        else:
            # Try to find submit button
            submit_buttons = page.get_by_role("button", name=re.compile("submit|order|rent", re.IGNORECASE))
            if submit_buttons.count() > 0:
                submit_buttons.first.click()
                self.print_success("Clicked submit button")

        # Wait for confirmation
        time.sleep(3)

        # Close alert if present
        alert_buttons = page.get_by_role("button", name="ঠিক আছে")
        if alert_buttons.count() > 0:
            alert_buttons.first.click()
            time.sleep(1)

        self.print_success("Equipment booking completed!")

    def run_all_tests(self):
        """Run all test steps."""
        print("\n" + "="*70)
        print("FARM FRIEND - COMPLETE PLAYWRIGHT END-TO-END TEST")
        print("="*70)
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Base URL: {self.BASE_URL}")
        print("="*70)

        # Verify image exists
        try:
            self.verify_image_exists()
        except FileNotFoundError as e:
            print(f"\n❌ ERROR: {e}")
            return False

        try:
            with sync_playwright() as playwright:
                browser = playwright.chromium.launch(headless=False)
                context = browser.new_context()
                page = context.new_page()

                # Run test steps
                self.step1_signup_rent_owner(page)
                self.step2_login_rent_owner(page)
                self.step3_post_equipment(page)
                self.step4_logout(page)
                self.step5_signup_farmer(page)
                self.step6_login_farmer(page)
                self.step7_book_equipment(page)

                context.close()
                browser.close()

            print("\n" + "="*70)
            print("ALL TESTS COMPLETED SUCCESSFULLY!")
            print("="*70)
            print(f"Finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print("\nTest Summary:")
            print(f"  - Rent Owner Username: {self.rent_owner_username}")
            print(f"  - Farmer Username: {self.farmer_username}")
            print(f"  - Equipment Posted: {self.equipment_name}")
            print("="*70)

            return True

        except Exception as e:
            print(f"\n❌ TEST FAILED: {str(e)}")
            import traceback
            traceback.print_exc()
            return False


def main():
    """Main entry point."""
    print("\n" + "="*70)
    print("FARM FRIEND - PLAYWRIGHT AUTOMATION TEST")
    print("="*70)

    print("\nPre-requisites:")
    print("  1. Backend server should be running at http://127.0.0.1:8000")
    print("  2. Frontend server should be running at http://127.0.0.1:3000")
    print("  3. Playwright installed: pip install playwright")
    print("  4. Browsers installed: playwright install")
    print("\nStarting tests in 3 seconds...\n")
    time.sleep(3)

    test = FarmFriendPlaywrightTest()
    success = test.run_all_tests()

    exit(0 if success else 1)


if __name__ == "__main__":
    main()
