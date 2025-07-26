# Supabase Setup Guide for Karyalay

## 🚀 **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Click "New Project"
5. Fill in the details:
   - **Organization**: Create new or select existing
   - **Project Name**: `karyalay-venue-booking`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project"

## 🗄️ **Step 2: Set Up Database Schema**

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Create a new query and paste the following SQL:

```sql
-- Create users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create venues table
CREATE TABLE public.venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  price_per_day DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  image_url TEXT,
  amenities TEXT[],
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  guest_count INTEGER,
  special_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Venues: Anyone can view, only admins can modify
CREATE POLICY "Anyone can view venues" ON public.venues
  FOR SELECT USING (true);

-- Bookings: Users can only see their own bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone_number, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name', NEW.raw_user_meta_data->>'phone_number', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

4. Click **Run** to execute the SQL

## 📊 **Step 3: Insert Sample Venue Data**

1. In the SQL Editor, create another query
2. Paste the following SQL to insert sample venues:

```sql
INSERT INTO venues (name, description, address, city, state, capacity, price_per_hour, price_per_day, rating, image_url, amenities, is_available)
VALUES
  ('Grand Palace Hall', 'Elegant palace-style venue perfect for weddings and corporate events. Features beautiful architecture and modern amenities.', '123 Palace Road', 'Mumbai', 'Maharashtra', 500, 5000, 50000, 4.5, 'https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Grand+Palace', ARRAY['Parking', 'Catering', 'Audio/Visual', 'Air Conditioning', 'Wi-Fi', 'Decoration'], true),
  ('Modern Conference Center', 'State-of-the-art conference facility with modern amenities, perfect for business meetings and corporate events.', '456 Business Park', 'Delhi', 'NCR', 200, 2500, 25000, 4.2, 'https://via.placeholder.com/400x300/50C878/FFFFFF?text=Conference+Center', ARRAY['Projector', 'Sound System', 'Video Conferencing', 'Catering', 'Wi-Fi', 'Parking'], true),
  ('Garden Wedding Venue', 'Beautiful outdoor garden venue surrounded by nature, perfect for romantic weddings and outdoor celebrations.', '789 Garden Lane', 'Bangalore', 'Karnataka', 300, 3500, 35000, 4.7, 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Garden+Venue', ARRAY['Outdoor Setup', 'Garden Decoration', 'Catering', 'Photography Area', 'Parking', 'Restrooms'], true),
  ('Luxury Banquet Hall', 'Premium banquet hall with luxury amenities and catering services, ideal for high-end events and celebrations.', '321 Luxury Street', 'Chennai', 'Tamil Nadu', 400, 4500, 45000, 4.3, 'https://via.placeholder.com/400x300/9B59B6/FFFFFF?text=Luxury+Banquet', ARRAY['Luxury Decor', 'Premium Catering', 'Audio/Visual', 'Air Conditioning', 'Wi-Fi', 'Valet Parking'], true),
  ('Riverside Event Center', 'Stunning riverside location with panoramic views, perfect for memorable events and celebrations.', '654 River View Road', 'Hyderabad', 'Telangana', 250, 4000, 40000, 4.6, 'https://via.placeholder.com/400x300/3498DB/FFFFFF?text=Riverside+Center', ARRAY['Riverside View', 'Outdoor Seating', 'Catering', 'Photography Spots', 'Parking', 'Boat Access'], true),
  ('Tech Hub Meeting Space', 'Modern tech-focused meeting space with cutting-edge technology, perfect for startups and tech events.', '987 Innovation Drive', 'Pune', 'Maharashtra', 150, 3000, 30000, 4.4, 'https://via.placeholder.com/400x300/E74C3C/FFFFFF?text=Tech+Hub', ARRAY['High-Speed Internet', 'Video Conferencing', 'Whiteboards', 'Coffee Bar', 'Parking', 'Meeting Rooms'], true);
```

3. Click **Run** to insert the sample data

## 🔑 **Step 4: Get Your API Keys**

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy your **Project URL** and **anon public key**
3. Update the `src/config/supabase.ts` file with your actual keys:

```typescript
const supabaseUrl = "YOUR_ACTUAL_PROJECT_URL";
const supabaseAnonKey = "YOUR_ACTUAL_ANON_KEY";
```

## 🔧 **Step 5: Configure Authentication**

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Under **Site URL**, add your app's URL (for development, you can use `http://localhost:3000`)
3. Under **Redirect URLs**, add your app's redirect URLs

## 📱 **Step 6: Test the Integration**

1. Run your React Native app: `npm start`
2. Try signing up with a new user
3. Check if the user profile is created in Supabase
4. Browse venues and test the booking functionality

## 🎯 **What's Included**

### **Database Tables:**

- **profiles**: User profile information
- **venues**: Venue details with capacity, pricing, amenities
- **bookings**: Booking records with status tracking

### **Features:**

- ✅ **User Authentication** with Supabase Auth
- ✅ **Profile Management** with automatic profile creation
- ✅ **Venue Listing** with search and filtering
- ✅ **Booking System** with status management
- ✅ **Row Level Security** for data protection
- ✅ **Real-time Updates** (can be enabled)

### **API Endpoints Available:**

- User signup/signin/signout
- Profile CRUD operations
- Venue listing and details
- Booking creation and management

## 🚨 **Important Notes:**

1. **Save your database password** - you'll need it for admin access
2. **Keep your API keys secure** - don't commit them to public repositories
3. **Test thoroughly** - make sure all CRUD operations work as expected
4. **Monitor usage** - stay within Supabase's free tier limits

## 🔄 **Next Steps:**

1. **Update your React Native app** to use the new Supabase service
2. **Test all functionality** thoroughly
3. **Add real-time features** if needed
4. **Set up production environment** when ready to deploy

---

**Need help?** Check the [Supabase documentation](https://supabase.com/docs) or create an issue in your project repository.
