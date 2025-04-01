from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from blog_app.models import Post, Comment, UserProfile

class Command(BaseCommand):
    help = "Seed the database with initial data"

    def handle(self, *args, **kwargs):
        # Create or get groups
        moderators_group, _ = Group.objects.get_or_create(name="moderators")
        users_group, _ = Group.objects.get_or_create(name="users")

        # Create superuser
        if not User.objects.filter(username="liat").exists():
            superuser = User.objects.create_superuser(
                username="liat",
                email="liat@example.com",
                password="123456"
            )
            UserProfile.objects.create(user=superuser)
            superuser.groups.add(moderators_group)  # Add to moderators group
            self.stdout.write(self.style.SUCCESS("Superuser 'liat' created and added to 'moderators' group!"))
        else:
            superuser = User.objects.get(username="liat")
            self.stdout.write(self.style.WARNING("Superuser 'liat' already exists."))

        # Create regular users and assign them to 'users' group
        users_data = [
            {"username": "david", "email": "david@example.com", "password": "password123"},
            {"username": "sara", "email": "sara@example.com", "password": "password123"},
        ]

        users = []
        for user_data in users_data:
            if not User.objects.filter(username=user_data["username"]).exists():
                user = User.objects.create_user(
                    username=user_data["username"],
                    email=user_data["email"],
                    password=user_data["password"]
                )
                user_profile, created = UserProfile.objects.get_or_create(user=user)
                if created:
                    user_profile.phone = user_data.get("phone", "0555555555")
                    user_profile.country = user_data.get("country", "Israel")
                    user_profile.city = user_data.get("city", "Tel-Aviv")
                    user_profile.street = user_data.get("street", "somewhere")
                    user_profile.house_number = user_data.get("house_number", "1")
                    user_profile.bio = user_data.get("bio", "")
                    user_profile.profile_pic = user_data.get("profile_pic", "./img/pp_user.jpeg")
                    user_profile.birth_date = user_data.get("birth_date", None)
                    user_profile.save()
                if user_data["username"] == "liat":
                    user.groups.add(moderators_group)
                    user.groups.remove(users_group)  # לא לשים סופריוזר בקבוצת users
                else:
                    user.groups.add(users_group)

                user.groups.add(users_group)  # Add to users group
                users.append(user)
                self.stdout.write(self.style.SUCCESS(f"User '{user_data['username']}' created and added to 'users' group!"))
            else:
                user = User.objects.get(username=user_data["username"])
                users.append(user)
                self.stdout.write(self.style.WARNING(f"User '{user_data['username']}' already exists."))

        # Create 3 international news articles
        posts_data = [
            {
                "title": "Powerful Hurricane Strikes Florida",
                "subtitle": "Thousands evacuated as extreme weather conditions worsen.",
                "text": "People along the Florida Panhandle, Big Bend region and much of the eastern Gulf coast need to complete preparations for hurricane impacts by Wednesday night before hazardous conditions arrive on Thursday. An evolving storm in the western Caribbean is expected to intensify into a hurricane before moving north and making landfall along the United States Gulf Coast on Thursday, AccuWeather expert meteorologists are forecasting. Residents along much of the Gulf Coast need to complete preparations for hurricane impacts by Wednesday night before hazardous conditions arrive on Thursday, AccuWeather hurricane experts advised. “Everyone along the Florida Panhandle and Big Bend region needs to be prepared for hurricane impacts,” said AccuWeather Lead Hurricane Expert Alex DaSilva, adding that the setup has the potential to become the strongest hurricane landfall in the U.S. so far this season. 'The region we are closely watching is more commonly a threat to tropical development in the late-spring or mid- to late-autumn seasons,' said DaSilva. 'There's even evidence of the Central America gyre now, which is also more common in the spring and later in the autumn.' The gyre is a circulation of air that is not only rotating, but also rising. When air rises in the atmosphere, it creates low pressure and moisture, which in turn generates clouds, showers and thunderstorms. In the right environment, and with continued rotation and organization, a tropical system can form, which is what AccuWeather is expecting this week. Where will the storm go, and how strong will it get? Once the storm tracks inland, two possible scenarios could arise. One such scenario could involve a track farther inland across the Southeast states, while another could result in the storm advancing eastward along the Atlantic Southeast coast. Residents along the Gulf Coast from New Orleans to Key West, Florida, including the Tampa Bay metropolitan area, should closely monitor the progress of the potential storm. This developing tropical threat is currently forecast to impact similar areas to those that were hit hard by Hurricane Idalia in August 2023. The next tropical storm name on the list for the 2024 Atlantic hurricane season is Helene. “There are a lot of tall pine trees in Florida’s Big Bend and Nature Coast area. Those trees can be incredibly dangerous in hurricane-force winds. We saw a lot of trees fall onto houses and damage parked cars when Idalia hit the Big Bend region last August,” DaSilva warned.",
                "image_url": "https://cms.accuweather.com/wp-content/uploads/2024/09/infraredsatellite_satam921_092124_b8e35d.jpg?w=632",
                "author": superuser
            },
            {
                "title": "Japanese Government Approves Emergency Budget",
                "subtitle": "A drastic decision amid the ongoing economic crisis.",
                "text": "TOKYO, Jan 16 (Reuters) - Japanese Prime Minister Fumio Kishida's cabinet decided on Tuesday to double the planned amount of emergency budget reserves for fiscal 2024/25 to help recovery from the deadly Noto peninsula quakes, government officials said on Tuesday. The magnitude 7.6 earthquake devastated the Noto peninsula, northwest from Tokyo, on New Year's Day, leaving over 220 people dead and dozens of others missing, making it the deadliest since the 2016 quake in Kumamoto in the southern Kyushu region. Authorities will issue additional Japanese government bonds (JGBs) to double the amount of emergency reserves to 1 trillion yen ($6.86 billion) from the initially planned 500 billion yen. The move will slightly raise the debt-dependency ratio of the annual budget to 31.5% from 31.2% earlier planned, increasing the industrial world's worst debt burden which is more than twice the size of Japan's gross domestic product. With this measure, we thoroughly prepare for all eventualities, a finance ministry official told reporters. It is rare for the government to revise an annual draft budget already sent to parliament for debate and approval by the fiscal year-end in March. Parliament begins regular sessions later this month.Finance Minister Shunichi Suzuki said last week the budget reserves would enable the government to flexibly respond to any funding needs, without seeking advance approval by parliament. For the current fiscal year, the government has decided to spend 4.7 billion yen on evacuation centres. In addition, Kishida ordered his administration to compile a disaster relief package worth more than 100 billion yen by the end of this month to provide makeshift shelters, road and other infrastructure, and to help people make a living.Of a total budget spending plan worth 112 trillion yen for the next fiscal year, 500 billion yen is earmarked for general budget reserves. Budget reserves are often described as a useful fund for the government as they can be tapped at its own discretion and without the need for parliamentary approval. ($1 = 145.7900 yen)",
                "image_url": "https://www.reuters.com/resizer/v2/WXY52TXSWNO5TI25LPTVWLE4XA.jpg?auth=4baea40db4f0a7bf2d349d48e9c12eeb04fc831aa9317cdec14b0ac471cb3390&width=960&quality=80",
                "author": superuser
            },
            {
                "title": "NASA Launches Spacecraft for Mars Research",
                "subtitle": "A historic mission to uncover new data about the Red Planet.",
                "text": "NASA’s Perseverance Rover began its long journey to Mars today by successfully launching from Cape Canaveral Air Force Station on a ULA Atlas V rocket. It now begins its seven-month journey to the Red Planet, landing there on Feb. 18, 2021. Perseverance will seek signs of ancient microbial life on Mars along with collecting samples for future return to Earth and demonstrating key technologies to help prepare for future robotic and human exploration. Also flying with Perseverance is NASA’s Ingenuity helicopter, which will attempt to show controlled flight is possible in the very thin Martian atmosphere.",
                "image_url": "https://media.istockphoto.com/id/458097145/photo/nasas-logo.jpg?s=612x612&w=0&k=20&c=Q0xWr4TjqpA-YjTeV0lNOcRYJoTR7ULj6ef3PiyuH0U=",
                "author": superuser
            },
        ]

        posts = []
        for post_data in posts_data:
            post, created = Post.objects.get_or_create(
                title=post_data["title"],
                defaults={
                    "subtitle": post_data["subtitle"],
                    "text": post_data["text"],
                    "image_url": post_data["image_url"],
                    "author": post_data["author"],
                    "status": "published",
                },
            )
            posts.append(post)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Post '{post_data['title']}' created successfully!"))
            else:
                self.stdout.write(self.style.WARNING(f"Post '{post_data['title']}' already exists."))

        # Create 3 comments
        comments_data = [
            {"author": superuser.userprofile, "post": posts[0], "text": "This is terrifying! Hope the damage isn't too severe."},
            {"author": users[0].userprofile, "post": posts[1], "text": "I believe this budget will help stabilize the economy."},
            {"author": users[1].userprofile, "post": posts[2], "text": "Amazing! Can't wait to see NASA's new discoveries."},
        ]

        for comment_data in comments_data:
            comment, created = Comment.objects.get_or_create(
                author=comment_data["author"],
                post=comment_data["post"],
                defaults={"text": comment_data["text"]},
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Comment '{comment_data['text']}' added successfully!"))
            else:
                self.stdout.write(self.style.WARNING(f"Comment '{comment_data['text']}' already exists."))

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
