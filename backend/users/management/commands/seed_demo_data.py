"""
Django management command to seed demo data for Farm Friend application.
Creates demo users, farmers, storage owners, rent owners, agronomists,
and sample bookings/orders for testing and demonstration purposes.
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from decimal import Decimal

from users.models import UserInfo
from farmers.models import Farmer, Crops
from storage.models import StorageOwner, StorageOwnerGigs, StorageDeals
from rentals.models import RentOwner, RentItems, RentItemOrders
from consultations.models import Agronomist, ConsultationRequest


class Command(BaseCommand):
    help = 'Seeds the database with demo data for rentals, storage, and agronomist services'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Starting to seed demo data...'))
        
        # Create demo users
        self.create_demo_users()
        
        # Create demo farmers
        self.create_demo_farmers()
        
        # Create demo crops
        self.create_demo_crops()
        
        # Create demo storage owners and gigs
        self.create_demo_storage()
        
        # Create demo rent owners and items
        self.create_demo_rentals()
        
        # Create demo agronomists
        self.create_demo_agronomists()
        
        # Create demo bookings and orders
        self.create_demo_bookings()
        
        self.stdout.write(self.style.SUCCESS('✅ Demo data seeded successfully!'))

    def create_demo_users(self):
        """Create demo users for different roles"""
        self.stdout.write('Creating demo users...')
        
        demo_users = [
            # Farmers
            {'username': 'farmer_rahim', 'email': 'rahim@demo.com', 'password': 'demo123', 'is_farmer': True, 'first_name': 'Rahim', 'last_name': 'Uddin'},
            {'username': 'farmer_karim', 'email': 'karim@demo.com', 'password': 'demo123', 'is_farmer': True, 'first_name': 'Karim', 'last_name': 'Ahmed'},
            {'username': 'farmer_jalil', 'email': 'jalil@demo.com', 'password': 'demo123', 'is_farmer': True, 'first_name': 'Jalil', 'last_name': 'Mia'},
            # Storage Owners
            {'username': 'storage_salam', 'email': 'salam@demo.com', 'password': 'demo123', 'is_storage_owner': True, 'first_name': 'Salam', 'last_name': 'Khan'},
            {'username': 'storage_nur', 'email': 'nur@demo.com', 'password': 'demo123', 'is_storage_owner': True, 'first_name': 'Nur', 'last_name': 'Hasan'},
            {'username': 'storage_alam', 'email': 'alam@demo.com', 'password': 'demo123', 'is_storage_owner': True, 'first_name': 'Alam', 'last_name': 'Sheikh'},
            # Rent Owners
            {'username': 'rent_rafiq', 'email': 'rafiq@demo.com', 'password': 'demo123', 'is_rent_owner': True, 'first_name': 'Rafiq', 'last_name': 'Islam'},
            {'username': 'rent_habib', 'email': 'habib@demo.com', 'password': 'demo123', 'is_rent_owner': True, 'first_name': 'Habib', 'last_name': 'Rahman'},
            {'username': 'rent_shakil', 'email': 'shakil@demo.com', 'password': 'demo123', 'is_rent_owner': True, 'first_name': 'Shakil', 'last_name': 'Ahmed'},
            # Agronomists
            {'username': 'agro_dr_ali', 'email': 'dr.ali@demo.com', 'password': 'demo123', 'is_agronomist': True, 'first_name': 'Dr. Mohammad', 'last_name': 'Ali'},
            {'username': 'agro_prof_fatema', 'email': 'prof.fatema@demo.com', 'password': 'demo123', 'is_agronomist': True, 'first_name': 'Prof. Fatema', 'last_name': 'Begum'},
            {'username': 'agro_dr_kamrul', 'email': 'dr.kamrul@demo.com', 'password': 'demo123', 'is_agronomist': True, 'first_name': 'Dr. Kamrul', 'last_name': 'Hasan'},
            {'username': 'agro_dr_rasheda', 'email': 'dr.rasheda@demo.com', 'password': 'demo123', 'is_agronomist': True, 'first_name': 'Dr. Rasheda', 'last_name': 'Khatun'},
        ]
        
        self.users = {}
        for user_data in demo_users:
            username = user_data.pop('username')
            password = user_data.pop('password')
            user, created = UserInfo.objects.get_or_create(
                username=username,
                defaults=user_data
            )
            if created:
                user.set_password(password)
                user.save()
                self.stdout.write(f'  Created user: {username}')
            self.users[username] = user

    def create_demo_farmers(self):
        """Create demo farmer profiles"""
        self.stdout.write('Creating demo farmers...')
        
        farmers_data = [
            {'user': 'farmer_rahim', 'name': 'রহিম উদ্দিন', 'dob': date(1985, 5, 15), 'address': 'মানিকগঞ্জ, ঢাকা', 'contact': '01711111111', 'field_size': Decimal('5.5')},
            {'user': 'farmer_karim', 'name': 'করিম আহমেদ', 'dob': date(1980, 8, 20), 'address': 'গাজীপুর, ঢাকা', 'contact': '01722222222', 'field_size': Decimal('8.0')},
            {'user': 'farmer_jalil', 'name': 'জালিল মিয়া', 'dob': date(1975, 3, 10), 'address': 'ময়মনসিংহ', 'contact': '01733333333', 'field_size': Decimal('12.5')},
        ]
        
        self.farmers = {}
        for data in farmers_data:
            user = self.users.get(data.pop('user'))
            if user:
                farmer, created = Farmer.objects.get_or_create(
                    user=user,
                    defaults=data
                )
                if created:
                    self.stdout.write(f'  Created farmer: {farmer.name}')
                self.farmers[user.username] = farmer

    def create_demo_crops(self):
        """Create demo crops"""
        self.stdout.write('Creating demo crops...')
        
        farmer = list(self.farmers.values())[0] if self.farmers else None
        if not farmer:
            self.stdout.write(self.style.WARNING('  No farmer found, skipping crops'))
            return
            
        crops_data = ['ধান', 'গম', 'আলু', 'আম', 'পেঁয়াজ', 'সবজি', 'ভুট্টা', 'মাছ']
        
        self.crops = {}
        for crop_name in crops_data:
            crop, created = Crops.objects.get_or_create(
                name=crop_name,
                farmer=farmer
            )
            if created:
                self.stdout.write(f'  Created crop: {crop_name}')
            self.crops[crop_name] = crop

    def create_demo_storage(self):
        """Create demo storage owners and gigs"""
        self.stdout.write('Creating demo storage owners and gigs...')
        
        storage_owners_data = [
            {'user': 'storage_salam', 'name': 'সালাম কোল্ড স্টোরেজ', 'dob': date(1975, 6, 15), 'contact': '01811111111', 'address': 'মিরপুর, ঢাকা', 'no_of_deals': 45},
            {'user': 'storage_nur', 'name': 'নূর হাসান গুদামঘর', 'dob': date(1980, 9, 20), 'contact': '01822222222', 'address': 'চট্টগ্রাম', 'no_of_deals': 32},
            {'user': 'storage_alam', 'name': 'আলম এগ্রো স্টোরেজ', 'dob': date(1978, 4, 10), 'contact': '01833333333', 'address': 'রাজশাহী', 'no_of_deals': 28},
        ]
        
        self.storage_owners = {}
        for data in storage_owners_data:
            user = self.users.get(data.pop('user'))
            if user:
                owner, created = StorageOwner.objects.get_or_create(
                    user=user,
                    defaults=data
                )
                if created:
                    self.stdout.write(f'  Created storage owner: {owner.name}')
                self.storage_owners[user.username] = owner
        
        # Create storage gigs
        if not self.crops:
            self.stdout.write(self.style.WARNING('  No crops found, skipping storage gigs'))
            return
            
        storage_gigs_data = [
            {'owner': 'storage_salam', 'address': 'মিরপুর-১০, ঢাকা', 'description': 'আধুনিক কোল্ড স্টোরেজ সুবিধা। ধান, গম, আলু সংরক্ষণের জন্য উপযুক্ত। ২৪/৭ তাপমাত্রা নিয়ন্ত্রণ ব্যবস্থা।', 'crop': 'ধান', 'price': Decimal('500.00'), 'quantity': 100},
            {'owner': 'storage_salam', 'address': 'উত্তরা, ঢাকা', 'description': 'শুকনো শস্য সংরক্ষণের জন্য বিশেষ গুদামঘর। পোকামাকড় প্রতিরোধী।', 'crop': 'গম', 'price': Decimal('450.00'), 'quantity': 80},
            {'owner': 'storage_nur', 'address': 'আগ্রাবাদ, চট্টগ্রাম', 'description': 'বড় ধারণক্ষমতার গুদামঘর। সবজি ও ফল সংরক্ষণের জন্য আদর্শ।', 'crop': 'আলু', 'price': Decimal('600.00'), 'quantity': 150},
            {'owner': 'storage_nur', 'address': 'পতেঙ্গা, চট্টগ্রাম', 'description': 'মাছ ও সামুদ্রিক খাবার সংরক্ষণের জন্য হিমাগার।', 'crop': 'মাছ', 'price': Decimal('800.00'), 'quantity': 50},
            {'owner': 'storage_alam', 'address': 'শাহ মখদুম, রাজশাহী', 'description': 'আম ও লিচু সংরক্ষণের জন্য বিশেষায়িত কোল্ড স্টোরেজ।', 'crop': 'আম', 'price': Decimal('700.00'), 'quantity': 60},
            {'owner': 'storage_alam', 'address': 'বোয়ালিয়া, রাজশাহী', 'description': 'পেঁয়াজ ও রসুন সংরক্ষণের জন্য শুষ্ক গুদামঘর।', 'crop': 'পেঁয়াজ', 'price': Decimal('400.00'), 'quantity': 200},
        ]
        
        self.storage_gigs = []
        for data in storage_gigs_data:
            owner = self.storage_owners.get(data.pop('owner'))
            crop = self.crops.get(data.pop('crop'))
            if owner and crop:
                gig, created = StorageOwnerGigs.objects.get_or_create(
                    storage_owner=owner,
                    address=data['address'],
                    defaults={**data, 'prefered_crop': crop, 'is_Available': True}
                )
                if created:
                    self.stdout.write(f'  Created storage gig: {gig.address}')
                self.storage_gigs.append(gig)

    def create_demo_rentals(self):
        """Create demo rent owners and items"""
        self.stdout.write('Creating demo rent owners and items...')
        
        rent_owners_data = [
            {'user': 'rent_rafiq', 'name': 'রফিক যন্ত্রপাতি ভাড়া', 'dob': date(1978, 7, 15), 'contact': '01911111111', 'address': 'গাজীপুর, ঢাকা', 'no_of_deals': 120, 'ratings': Decimal('4.8')},
            {'user': 'rent_habib', 'name': 'হাবিব এগ্রো মেশিনারি', 'dob': date(1982, 3, 20), 'contact': '01922222222', 'address': 'ময়মনসিংহ', 'no_of_deals': 85, 'ratings': Decimal('4.5')},
            {'user': 'rent_shakil', 'name': 'শাকিল ট্রাক্টর সার্ভিস', 'dob': date(1985, 11, 10), 'contact': '01933333333', 'address': 'বগুড়া', 'no_of_deals': 95, 'ratings': Decimal('4.7')},
        ]
        
        self.rent_owners = {}
        for data in rent_owners_data:
            user = self.users.get(data.pop('user'))
            if user:
                owner, created = RentOwner.objects.get_or_create(
                    user=user,
                    defaults=data
                )
                if created:
                    self.stdout.write(f'  Created rent owner: {owner.name}')
                self.rent_owners[user.username] = owner
        
        # Create rent items
        rent_items_data = [
            {'owner': 'rent_rafiq', 'product_name': 'পাওয়ার টিলার', 'description': '১৫ HP পাওয়ার টিলার। জমি চাষের জন্য আদর্শ। জ্বালানি সাশ্রয়ী এবং সহজে চালানো যায়।', 'price': Decimal('800.00'), 'quantity': 5},
            {'owner': 'rent_rafiq', 'product_name': 'ধান কাটার মেশিন (হার্ভেস্টার)', 'description': 'আধুনিক কম্বাইন হার্ভেস্টার। একই সাথে ধান কাটা ও মাড়াই করে। বড় জমির জন্য উপযুক্ত।', 'price': Decimal('3500.00'), 'quantity': 2},
            {'owner': 'rent_rafiq', 'product_name': 'রোটাভেটর', 'description': 'ট্রাক্টর চালিত রোটাভেটর। মাটি ভাঙ্গা ও সমান করার জন্য। দ্রুত কাজ করে।', 'price': Decimal('1500.00'), 'quantity': 3},
            {'owner': 'rent_habib', 'product_name': 'ট্রাক্টর (৪৫ HP)', 'description': 'মাহিন্দ্রা ট্রাক্টর ৪৫ HP। ভারী কাজের জন্য উপযুক্ত। চাষ, মাল বহন সব কাজে ব্যবহার করা যায়।', 'price': Decimal('2500.00'), 'quantity': 3},
            {'owner': 'rent_habib', 'product_name': 'স্প্রে মেশিন', 'description': 'ব্যাকপ্যাক স্প্রেয়ার। কীটনাশক ও সার প্রয়োগের জন্য। ২০ লিটার ধারণক্ষমতা।', 'price': Decimal('200.00'), 'quantity': 15},
            {'owner': 'rent_habib', 'product_name': 'ধান মাড়াই মেশিন', 'description': 'থ্রেশার মেশিন। ধান থেকে খড় আলাদা করে। দ্রুত ও পরিষ্কার কাজ।', 'price': Decimal('900.00'), 'quantity': 6},
            {'owner': 'rent_shakil', 'product_name': 'সেচ পাম্প', 'description': 'ডিজেল চালিত সেচ পাম্প। ৫ HP মোটর। ঘণ্টায় ৫০০০ লিটার পানি তোলার ক্ষমতা।', 'price': Decimal('600.00'), 'quantity': 8},
            {'owner': 'rent_shakil', 'product_name': 'বীজ বপন যন্ত্র (সিডার)', 'description': 'স্বয়ংক্রিয় বীজ বপন যন্ত্র। সারিবদ্ধভাবে বীজ বপন করে। সময় ও শ্রম সাশ্রয়ী।', 'price': Decimal('1200.00'), 'quantity': 4},
        ]
        
        self.rent_items = []
        for data in rent_items_data:
            owner = self.rent_owners.get(data.pop('owner'))
            if owner:
                item, created = RentItems.objects.get_or_create(
                    rent_owner=owner,
                    product_name=data['product_name'],
                    defaults={**data, 'is_available': True}
                )
                if created:
                    self.stdout.write(f'  Created rent item: {item.product_name}')
                self.rent_items.append(item)

    def create_demo_agronomists(self):
        """Create demo agronomists"""
        self.stdout.write('Creating demo agronomists...')
        
        agronomists_data = [
            {
                'user': 'agro_dr_ali',
                'name': 'ড. মোহাম্মদ আলী',
                'dob': date(1970, 5, 15),
                'contact': '01711234567',
                'address': 'ঢাকা বিশ্ববিদ্যালয়, ঢাকা',
                'description': 'কৃষি বিজ্ঞানে ৩০ বছরের অভিজ্ঞতা। ধান ও গমের রোগ প্রতিরোধে বিশেষজ্ঞ। বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউটের সাবেক পরিচালক।',
                'specialty': 'ফসলের রোগ প্রতিরোধ',
                'fee': Decimal('500.00'),
                'years_of_experience': 30,
                'availability': True
            },
            {
                'user': 'agro_prof_fatema',
                'name': 'প্রফেসর ফাতেমা বেগম',
                'dob': date(1975, 8, 20),
                'contact': '01812345678',
                'address': 'বাংলাদেশ কৃষি বিশ্ববিদ্যালয়, ময়মনসিংহ',
                'description': 'মাটি ও সার বিশেষজ্ঞ। জৈব সার ও মাটির স্বাস্থ্য নিয়ে গবেষণা করেন। কৃষকদের জমির উর্বরতা বৃদ্ধিতে সহায়তা করেন।',
                'specialty': 'মাটি ও সার ব্যবস্থাপনা',
                'fee': Decimal('400.00'),
                'years_of_experience': 20,
                'availability': True
            },
            {
                'user': 'agro_dr_kamrul',
                'name': 'ড. কামরুল হাসান',
                'dob': date(1980, 3, 10),
                'contact': '01912345678',
                'address': 'শেরেবাংলা কৃষি বিশ্ববিদ্যালয়, ঢাকা',
                'description': 'সবজি চাষ ও বালাই দমনে বিশেষজ্ঞ। আধুনিক কৃষি প্রযুক্তি ও জৈবিক বালাইনাশক নিয়ে কাজ করেন।',
                'specialty': 'সবজি চাষ ও বালাই দমন',
                'fee': Decimal('350.00'),
                'years_of_experience': 15,
                'availability': True
            },
            {
                'user': 'agro_dr_rasheda',
                'name': 'ড. রাশেদা খাতুন',
                'dob': date(1978, 11, 25),
                'contact': '01612345678',
                'address': 'বরিশাল কৃষি বিশ্ববিদ্যালয়',
                'description': 'ফল চাষ বিশেষজ্ঞ। আম, লিচু, কাঁঠাল চাষে দীর্ঘ অভিজ্ঞতা। ফলের রোগ ও পোকামাকড় দমনে পরামর্শ দেন।',
                'specialty': 'ফল চাষ ও ব্যবস্থাপনা',
                'fee': Decimal('450.00'),
                'years_of_experience': 18,
                'availability': True
            },
        ]
        
        self.agronomists = {}
        for data in agronomists_data:
            user = self.users.get(data.pop('user'))
            if user:
                agronomist, created = Agronomist.objects.get_or_create(
                    user=user,
                    defaults=data
                )
                if created:
                    self.stdout.write(f'  Created agronomist: {agronomist.name}')
                self.agronomists[user.username] = agronomist

    def create_demo_bookings(self):
        """Create demo bookings for storage, rentals, and consultations"""
        self.stdout.write('Creating demo bookings and orders...')
        
        # Storage Deals
        if self.farmers and self.storage_owners and self.storage_gigs:
            farmer = list(self.farmers.values())[0]
            
            for i, gig in enumerate(self.storage_gigs[:3]):
                deal, created = StorageDeals.objects.get_or_create(
                    farmer=farmer,
                    gigs_offered=gig,
                    defaults={
                        'storage_owner': gig.storage_owner,
                        'crops': gig.prefered_crop,
                        'start_date': date.today(),
                        'end_date': date.today() + timedelta(days=30 * (i + 1)),
                        'completed': i == 0,
                        'is_confirmed': i < 2,
                        'is_ready_for_pickup': i == 0
                    }
                )
                if created:
                    self.stdout.write(f'  Created storage deal for: {gig.address}')
        
        # Rental Orders
        if self.rent_owners and self.rent_items:
            rent_taker = list(self.users.values())[0]  # Use first user as rent taker
            
            for i, item in enumerate(self.rent_items[:4]):
                order, created = RentItemOrders.objects.get_or_create(
                    rent_owner=item.rent_owner,
                    title=item.product_name,
                    rent_taker=rent_taker,
                    defaults={
                        'return_date': date.today() + timedelta(days=7 * (i + 1)),
                        'description': f'{item.product_name} ভাড়া নেওয়া হয়েছে। যত্ন সহকারে ব্যবহার করুন।',
                        'price': item.price,
                        'is_confirmed': i < 2,
                        'is_ready_for_pickup': i == 0
                    }
                )
                if created:
                    self.stdout.write(f'  Created rental order for: {item.product_name}')
        
        # Consultation Requests
        if self.farmers and self.agronomists:
            farmer = list(self.farmers.values())[0]
            
            consultation_details = [
                'আমার ধান ক্ষেতে পাতা হলুদ হয়ে যাচ্ছে। কী করব?',
                'জমিতে সার প্রয়োগের সঠিক সময় ও পরিমাণ জানতে চাই।',
                'টমেটো গাছে পোকার আক্রমণ হয়েছে। জৈবিক উপায়ে দমন করতে চাই।',
                'আমের মুকুল ঝরে যাচ্ছে। কী কারণে হতে পারে?',
            ]
            
            statuses = ['Pending', 'Accepted', 'Completed', 'Pending']
            
            for i, (username, agronomist) in enumerate(list(self.agronomists.items())[:4]):
                detail = consultation_details[i] if i < len(consultation_details) else 'পরামর্শ প্রয়োজন।'
                status = statuses[i] if i < len(statuses) else 'Pending'
                
                consultation, created = ConsultationRequest.objects.get_or_create(
                    farmer=farmer,
                    agronomist=agronomist,
                    details=detail,
                    defaults={
                        'fee': agronomist.fee,
                        'status': status,
                        'meet_link': 'https://meet.google.com/demo-meeting' if status == 'Accepted' else None,
                        'resolution': 'সমস্যার সমাধান দেওয়া হয়েছে। নির্দেশনা অনুসরণ করুন।' if status == 'Completed' else None
                    }
                )
                if created:
                    self.stdout.write(f'  Created consultation with: {agronomist.name}')
        
        self.stdout.write(self.style.SUCCESS('Demo bookings created!'))
