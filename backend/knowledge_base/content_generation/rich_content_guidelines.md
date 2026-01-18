# Rich Content Generation Guidelines for AMAR System

## CRITICAL: NO MINIMAL PLACEHOLDERS

**PROBLEM**: Generated websites often have minimal content like:
- Single-line descriptions
- Just component names as headers
- 4-5 lines total on landing pages
- No actual marketing copy or valuable content

**SOLUTION**: Generate COMPLETE, PRODUCTION-READY content that looks like a real business website.

## Content Generation Philosophy

### What "Production-Ready Content" Means

Production-ready content is content that:
- **Looks professional** - Could be used for actual marketing/sales
- **Is comprehensive** - Multiple paragraphs, sections, details
- **Engages users** - Compelling copy that drives action
- **Provides value** - Actually explains what the business/product does
- **Fills the page** - Full landing page with 500-1000+ words
- **Includes specifics** - Real details, not generic placeholders

### ❌ WRONG: Minimal Placeholder Content

```typescript
// DON'T DO THIS - Too minimal, looks unfinished
const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Main landing page for a pizzeria shop</p>
      
      <h2>Hero</h2>
      <p>Large hero section with welcoming message</p>
      
      <h2>MenuSection</h2>
      <p>Section displaying menu items</p>
      
      <h2>ContactSection</h2>
      <p>Section providing contact details</p>
    </div>
  );
};
```

**Problems with this approach**:
- Only ~80 words total
- No actual menu items
- No contact information
- No business details
- Not usable for marketing
- Looks like a wireframe, not a website

### ✅ CORRECT: Rich, Production-Ready Content

```typescript
// DO THIS - Full, comprehensive content
const Home: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center' as const
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: 'bold' }}>
          🍕 Bella Napoli Pizzeria
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '30px', opacity: 0.95 }}>
          Authentic Italian Pizza Made with Love Since 1985
        </p>
        <p style={{ fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto 40px', lineHeight: '1.8' }}>
          Experience the taste of Naples in every bite. Our wood-fired pizzas are crafted using 
          traditional recipes passed down through three generations, featuring imported Italian 
          ingredients and dough aged for 48 hours for the perfect crust.
        </p>
        <button style={{
          background: '#ff6b35',
          color: 'white',
          border: 'none',
          padding: '15px 40px',
          fontSize: '1.2rem',
          borderRadius: '30px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          Order Online Now
        </button>
      </section>

      {/* About Section */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center' as const, marginBottom: '40px', color: '#333' }}>
          Our Story 📖
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div>
            <h3 style={{ color: '#667eea', fontSize: '1.5rem', marginBottom: '15px' }}>
              Traditional Methods
            </h3>
            <p style={{ lineHeight: '1.8', color: '#555' }}>
              Our master pizzaiolos trained in Naples bring centuries of tradition to every pizza. 
              We use a wood-fired oven imported from Italy, reaching temperatures of 900°F to create 
              the signature leopard-spotted crust that defines authentic Neapolitan pizza.
            </p>
          </div>
          <div>
            <h3 style={{ color: '#667eea', fontSize: '1.5rem', marginBottom: '15px' }}>
              Premium Ingredients
            </h3>
            <p style={{ lineHeight: '1.8', color: '#555' }}>
              We source San Marzano tomatoes directly from the volcanic soil of Mount Vesuvius, 
              buffalo mozzarella from Campania, and extra virgin olive oil from Tuscany. Our flour 
              is stone-ground from Italian wheat for the authentic taste.
            </p>
          </div>
          <div>
            <h3 style={{ color: '#667eea', fontSize: '1.5rem', marginBottom: '15px' }}>
              Family Legacy
            </h3>
            <p style={{ lineHeight: '1.8', color: '#555' }}>
              Founded by Giuseppe Rossi in 1985, Bella Napoli has been a family affair for nearly 
              40 years. Giuseppe's grandchildren now run the restaurant, keeping his vision alive 
              while adding modern touches to the classic menu.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Highlights Section */}
      <section style={{ background: '#f8f9fa', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center' as const, marginBottom: '20px', color: '#333' }}>
            Our Signature Pizzas 🍕
          </h2>
          <p style={{ textAlign: 'center' as const, fontSize: '1.1rem', color: '#666', marginBottom: '50px' }}>
            Handcrafted with love, baked to perfection
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {/* Pizza Card 1 */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease'
            }}>
              <h3 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '15px' }}>
                Margherita Classica
              </h3>
              <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '15px' }}>
                The Original | Since 1889
              </p>
              <p style={{ lineHeight: '1.7', color: '#555', marginBottom: '20px' }}>
                The queen of pizzas. San Marzano tomato sauce, creamy buffalo mozzarella, 
                fresh basil leaves, and a drizzle of extra virgin olive oil on our signature 
                48-hour fermented dough.
              </p>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                  $16.99
                </p>
                <p style={{ fontSize: '0.9rem', color: '#999' }}>
                  12" Traditional Size
                </p>
              </div>
            </div>

            {/* Pizza Card 2 */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '15px' }}>
                Diavola Piccante
              </h3>
              <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '15px' }}>
                Spicy & Bold | Chef's Favorite 🔥
              </p>
              <p style={{ lineHeight: '1.7', color: '#555', marginBottom: '20px' }}>
                For those who like it hot! Spicy soppressata, Calabrian chili peppers, 
                fresh mozzarella, tomato sauce, and hot honey drizzle. Our most popular 
                pizza among spice lovers.
              </p>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                  $19.99
                </p>
                <p style={{ fontSize: '0.9rem', color: '#999' }}>
                  12" Traditional Size
                </p>
              </div>
            </div>

            {/* Pizza Card 3 */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '15px' }}>
                Quattro Formaggi
              </h3>
              <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '15px' }}>
                Four Cheese Perfection 🧀
              </p>
              <p style={{ lineHeight: '1.7', color: '#555', marginBottom: '20px' }}>
                A cheese lover's dream. Mozzarella, gorgonzola, fontina, and parmigiano-reggiano 
                on a white sauce base. Finished with fresh arugula and a balsamic glaze. 
                Simply indulgent.
              </p>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                  $18.99
                </p>
                <p style={{ fontSize: '0.9rem', color: '#999' }}>
                  12" Traditional Size
                </p>
              </div>
            </div>

            {/* Pizza Card 4 */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '15px' }}>
                Prosciutto e Rucola
              </h3>
              <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '15px' }}>
                Elegant & Fresh ⭐
              </p>
              <p style={{ lineHeight: '1.7', color: '#555', marginBottom: '20px' }}>
                Thinly sliced Prosciutto di Parma (aged 18 months), fresh arugula, 
                shaved parmigiano, cherry tomatoes, and a lemon-infused olive oil. 
                Light, sophisticated, and utterly delicious.
              </p>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                  $21.99
                </p>
                <p style={{ fontSize: '0.9rem', color: '#999' }}>
                  12" Traditional Size
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' as const, marginTop: '50px' }}>
            <button style={{
              background: 'transparent',
              color: '#667eea',
              border: '2px solid #667eea',
              padding: '15px 40px',
              fontSize: '1.1rem',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              View Full Menu →
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center' as const, marginBottom: '20px', color: '#333' }}>
          Visit Us Today 📍
        </h2>
        <p style={{ textAlign: 'center' as const, fontSize: '1.1rem', color: '#666', marginBottom: '50px' }}>
          Come experience authentic Italian hospitality
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {/* Location Card */}
          <div style={{ textAlign: 'center' as const }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '2rem'
            }}>
              📍
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#333' }}>Location</h3>
            <p style={{ lineHeight: '1.7', color: '#666' }}>
              456 Little Italy Avenue<br />
              Brooklyn, NY 11201<br />
              <span style={{ fontSize: '0.9rem', color: '#999' }}>
                (Between Mulberry & Grand St)
              </span>
            </p>
          </div>

          {/* Hours Card */}
          <div style={{ textAlign: 'center' as const }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '2rem'
            }}>
              ⏰
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#333' }}>Hours</h3>
            <p style={{ lineHeight: '1.7', color: '#666' }}>
              <strong>Mon-Thu:</strong> 11:00 AM - 10:00 PM<br />
              <strong>Fri-Sat:</strong> 11:00 AM - 11:00 PM<br />
              <strong>Sunday:</strong> 12:00 PM - 9:00 PM<br />
              <span style={{ fontSize: '0.9rem', color: '#999' }}>
                Happy Hour: Mon-Fri 3-6 PM
              </span>
            </p>
          </div>

          {/* Contact Card */}
          <div style={{ textAlign: 'center' as const }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '2rem'
            }}>
              📞
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#333' }}>Contact</h3>
            <p style={{ lineHeight: '1.7', color: '#666' }}>
              <strong>Phone:</strong> (718) 555-PIZZA<br />
              <strong>Email:</strong> info@bellanapoli.com<br />
              <strong>Reservations:</strong> book@bellanapoli.com<br />
              <span style={{ fontSize: '0.9rem', color: '#999' }}>
                Follow us @BellaNapoliNY
              </span>
            </p>
          </div>
        </div>

        <div style={{
          marginTop: '60px',
          padding: '40px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          color: 'white',
          textAlign: 'center' as const
        }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '15px' }}>
            🎉 Special Offer: Free Garlic Knots!
          </h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '25px', opacity: 0.95 }}>
            Sign up for our newsletter and get a free order of garlic knots on your next visit!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                padding: '15px 20px',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '30px',
                minWidth: '300px'
              }}
            />
            <button style={{
              background: '#ff6b35',
              color: 'white',
              border: 'none',
              padding: '15px 40px',
              fontSize: '1rem',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#2d3436',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center' as const
      }}>
        <p style={{ marginBottom: '10px', fontSize: '1.1rem' }}>
          © 2024 Bella Napoli Pizzeria. All rights reserved.
        </p>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
          Made with ❤️ and 🍕 in Brooklyn
        </p>
      </footer>
    </div>
  );
};
```

**Why this is better**:
- **~1200+ words** of actual content
- **Real business details** (address, hours, phone)
- **Specific menu items** with descriptions and prices
- **Compelling marketing copy** that sells
- **Visual hierarchy** with proper styling
- **Multiple sections** (Hero, About, Menu, Contact, CTA, Footer)
- **Emotional connection** (story, tradition, family)
- **Call-to-actions** that drive business goals
- **Professional appearance** suitable for production

## Content Generation Rules

### Rule 1: Every Page Needs Substantial Content

**Minimum content per page type**:

| Page Type | Min Words | Min Sections | Examples |
|-----------|-----------|--------------|----------|
| Landing Page | 800-1200 | 5-7 | Hero, About, Features, Testimonials, CTA, Footer |
| About Page | 500-800 | 4-5 | Story, Team, Values, Mission, Timeline |
| Product/Service Page | 600-900 | 4-6 | Overview, Features, Benefits, Pricing, FAQ |
| Contact Page | 300-500 | 3-4 | Form, Location, Hours, Social Links |
| Blog/Article Page | 800-1500 | 5-8 | Title, Intro, Body Sections, Conclusion, Related |

### Rule 2: Use Specific, Real-Sounding Details

❌ **Generic**: "Our restaurant serves food"
✅ **Specific**: "Bella Napoli Pizzeria serves authentic Neapolitan pizza using imported Italian ingredients and traditional wood-fired ovens"

❌ **Generic**: "Contact us for more information"
✅ **Specific**: "Call us at (718) 555-PIZZA or email info@bellanapoli.com - we respond within 2 hours during business hours"

❌ **Generic**: "We have many menu items"
✅ **Specific**: "Our menu features 12 signature pizzas, 8 pasta dishes, 15 appetizers, and seasonal specials that change monthly"

### Rule 3: Include Multiple Content Layers

Every section should have:

1. **Heading** (H2/H3)
2. **Subheading or tagline** (descriptive text)
3. **Main content** (2-4 paragraphs)
4. **Supporting details** (lists, features, benefits)
5. **Call-to-action** (button, link, form)
6. **Visual elements** (emojis, icons, colors)

### Rule 4: Write Compelling Marketing Copy

Use these copywriting techniques:

**Before & After**:
- "Before: Spending hours on manual data entry"
- "After: Automate 90% of your workflow in minutes"

**Problem-Solution**:
- "Tired of juggling multiple tools? Our all-in-one platform brings everything together"

**Social Proof**:
- "Join 50,000+ businesses that trust our platform"
- "Rated 4.9/5 stars by 2,000+ users"

**Specific Numbers**:
- "Save 15 hours per week"
- "Reduce costs by 40%"
- "Deploy in under 5 minutes"

**Emotional Benefits**:
- "Spend more time with family, less time on busywork"
- "Sleep better knowing your data is secure"
- "Feel confident presenting to clients"

### Rule 5: Create Rich Visual Hierarchy

Use these styling techniques:

```typescript
// Different text sizes for hierarchy
const headingStyle = { fontSize: '3rem', fontWeight: 'bold' };
const subheadingStyle = { fontSize: '1.5rem', opacity: 0.9 };
const bodyStyle = { fontSize: '1.1rem', lineHeight: '1.8' };
const captionStyle = { fontSize: '0.9rem', color: '#999' };

// Color psychology
const trustColor = '#667eea'; // Blue - trust, professional
const urgencyColor = '#ff6b35'; // Orange - action, urgency
const successColor = '#51cf66'; // Green - success, growth
const premiumColor = '#9c27b0'; // Purple - luxury, creativity

// Spacing for readability
const sectionPadding = { padding: '80px 20px' };
const cardGap = { gap: '30px' };
const paragraphMargin = { marginBottom: '20px' };
```

### Rule 6: Include Realistic Business Information

When generating business websites, include:

**Contact Information**:
- Full address with street, city, state, zip
- Phone number (use 555 exchange for examples)
- Email (realistic format like info@businessname.com)
- Social media handles

**Business Hours**:
- Specific hours for each day
- Special hours (holidays, happy hour)
- Timezone information

**Pricing Information**:
- Specific prices, not "contact for quote"
- Multiple pricing tiers
- What's included in each tier
- Money-back guarantees or free trials

**Team Information**:
- Names and roles
- Brief bios (2-3 sentences)
- Photos (describe what photo would show)
- Contact methods for specific people

### Rule 7: Write for Different Audiences

Adjust tone based on business type:

**B2B SaaS** (professional, ROI-focused):
```typescript
<h1>Enterprise-Grade Analytics Platform</h1>
<p>
  Empower your data team with real-time insights, predictive analytics, 
  and seamless integrations. Trusted by Fortune 500 companies to make 
  data-driven decisions that increase revenue by an average of 32%.
</p>
```

**E-commerce** (emotional, benefit-focused):
```typescript
<h1>Handcrafted Leather Bags That Last a Lifetime</h1>
<p>
  Each bag is meticulously crafted by artisan leather workers using 
  full-grain Italian leather. Not fast fashion - these are heirloom 
  pieces you'll pass down to your children. 
</p>
```

**Local Business** (community-focused, warm):
```typescript
<h1>Your Neighborhood Coffee Shop Since 2005</h1>
<p>
  More than just coffee - we're your morning ritual, your afternoon 
  break, your weekend hangout. Every cup is roasted in-house, every 
  customer is family. Come see why locals call us their "second home."
</p>
```

**Non-profit** (mission-driven, impact-focused):
```typescript
<h1>Together, We Can End Youth Homelessness</h1>
<p>
  Every night, 4,000 youth sleep on our city streets. But it doesn't 
  have to be this way. With your support, we've helped 500 young people 
  find stable housing, education, and hope for a brighter future.
</p>
```

## Content Templates by Page Type

### Landing Page Template

```typescript
const LandingPage: React.FC = () => {
  return (
    <div>
      {/* 1. HERO SECTION (100-150 words) */}
      <section>
        <h1>[Compelling Value Proposition]</h1>
        <p>[Subheading explaining what you do]</p>
        <p>[2-3 sentences with specific benefits]</p>
        <button>[Primary CTA]</button>
        <p>[Social proof or trust indicator]</p>
      </section>

      {/* 2. PROBLEM SECTION (100-150 words) */}
      <section>
        <h2>[The Problem You Solve]</h2>
        <p>[2-3 paragraphs explaining the pain points]</p>
        <ul>
          <li>[Specific problem #1 with details]</li>
          <li>[Specific problem #2 with details]</li>
          <li>[Specific problem #3 with details]</li>
        </ul>
      </section>

      {/* 3. SOLUTION SECTION (150-200 words) */}
      <section>
        <h2>[Your Solution]</h2>
        <p>[How your product/service solves the problems]</p>
        <div>[3-4 feature cards, each with]:
          <h3>[Feature name]</h3>
          <p>[2-3 sentences explaining the feature]</p>
          <p>[Specific benefit or result]</p>
        </div>
      </section>

      {/* 4. HOW IT WORKS (100-150 words) */}
      <section>
        <h2>[How It Works]</h2>
        <div>[3-4 steps, each with]:
          <h3>Step [#]: [Action]</h3>
          <p>[2-3 sentences explaining this step]</p>
        </div>
      </section>

      {/* 5. BENEFITS/RESULTS (150-200 words) */}
      <section>
        <h2>[Key Benefits]</h2>
        <div>[3-6 benefit cards with]:
          <h3>[Benefit headline with emoji]</h3>
          <p>[Specific, measurable benefit]</p>
          <p>[Real-world example or statistic]</p>
        </div>
      </section>

      {/* 6. SOCIAL PROOF (100-150 words) */}
      <section>
        <h2>[Customer Success Stories]</h2>
        <div>[2-3 testimonials, each with]:
          <p>"[Specific quote about results]"</p>
          <p>- [Name], [Title] at [Company]</p>
        </div>
        <p>[Statistics: "Join X customers who..."]</p>
      </section>

      {/* 7. PRICING (if applicable, 100-150 words) */}
      <section>
        <h2>[Pricing Options]</h2>
        <div>[2-3 pricing tiers, each with]:
          <h3>[Tier Name]</h3>
          <p>[Price with billing period]</p>
          <ul>[5-8 specific features included]</ul>
          <button>[CTA button]</button>
        </div>
      </section>

      {/* 8. FAQ (100-150 words) */}
      <section>
        <h2>[Frequently Asked Questions]</h2>
        <div>[5-8 Q&A pairs with detailed answers]</div>
      </section>

      {/* 9. FINAL CTA (50-100 words) */}
      <section>
        <h2>[Compelling CTA Headline]</h2>
        <p>[Urgency or incentive]</p>
        <button>[Primary CTA]</button>
        <p>[Risk reversal: money-back guarantee, etc.]</p>
      </section>

      {/* 10. FOOTER (50-100 words) */}
      <footer>
        <div>[Company info, links, contact, social]</div>
      </footer>
    </div>
  );
};
```

**Total: 800-1200 words minimum**

### About Page Template

```typescript
const AboutPage: React.FC = () => {
  return (
    <div>
      {/* 1. HERO/MISSION (100-150 words) */}
      <section>
        <h1>[Company Name] - [Tagline]</h1>
        <p>[Mission statement - 2-3 sentences]</p>
        <p>[Founding story - 2-3 paragraphs]</p>
      </section>

      {/* 2. STORY/HISTORY (150-200 words) */}
      <section>
        <h2>[Our Story]</h2>
        <p>[Detailed history - 3-4 paragraphs covering]:
          - How the company started
          - Key milestones
          - Challenges overcome
          - Current state
        </p>
      </section>

      {/* 3. VALUES (100-150 words) */}
      <section>
        <h2>[Our Values]</h2>
        <div>[4-6 value cards, each with]:
          <h3>[Value Name]</h3>
          <p>[2-3 sentences explaining this value]</p>
        </div>
      </section>

      {/* 4. TEAM (150-200 words) */}
      <section>
        <h2>[Meet Our Team]</h2>
        <div>[4-8 team member cards, each with]:
          <h3>[Name]</h3>
          <p>[Title/Role]</p>
          <p>[2-3 sentence bio]</p>
        </div>
      </section>

      {/* 5. ACHIEVEMENTS (50-100 words) */}
      <section>
        <h2>[Achievements & Recognition]</h2>
        <ul>[5-10 specific achievements, awards, metrics]</ul>
      </section>
    </div>
  );
};
```

**Total: 500-800 words minimum**

### Contact Page Template

```typescript
const ContactPage: React.FC = () => {
  return (
    <div>
      {/* 1. HERO (50-100 words) */}
      <section>
        <h1>[Get In Touch]</h1>
        <p>[2-3 sentences about response time, channels]</p>
      </section>

      {/* 2. CONTACT FORM (form fields + 50 words) */}
      <section>
        <h2>[Send Us a Message]</h2>
        <form>[Detailed form with validations]</form>
      </section>

      {/* 3. CONTACT INFO (100-150 words) */}
      <section>
        <h2>[Other Ways to Reach Us]</h2>
        <div>[Multiple contact methods with details]:
          - Physical address
          - Phone numbers (departments)
          - Email addresses (departments)
          - Social media links
          - Live chat availability
        </div>
      </section>

      {/* 4. HOURS & LOCATION (100-150 words) */}
      <section>
        <h2>[Visit Us]</h2>
        <div>[Detailed hours, directions, parking info]</div>
        <div>[Map placeholder or description]</div>
      </section>
    </div>
  );
};
```

**Total: 300-500 words minimum**

## Industry-Specific Content Examples

### Restaurant/Food Business
- **Detailed menu items** with descriptions, ingredients, prices
- **Chef bios** and culinary philosophy
- **Sourcing information** (local, organic, etc.)
- **Dietary options** (vegan, gluten-free, etc.)
- **Reservation system** information
- **Special events** and private dining
- **Gift cards** and loyalty programs

### SaaS/Tech Product
- **Feature descriptions** with specific use cases
- **Integration list** with popular tools
- **Security & compliance** certifications
- **API documentation** overview
- **Customer success stories** with metrics
- **Pricing calculators** or comparison tables
- **Free trial** details and onboarding

### E-commerce
- **Product descriptions** with specifications
- **Sizing guides** and fit information
- **Material details** and care instructions
- **Shipping policies** with timeframes
- **Return policy** with clear process
- **Customer reviews** (realistic examples)
- **Bundle deals** and promotions

### Professional Services
- **Service packages** with deliverables
- **Process overview** step-by-step
- **Case studies** with results
- **Team credentials** and certifications
- **Client testimonials** with specifics
- **Industry expertise** areas
- **Consultation booking** system

### Non-Profit
- **Mission and impact** metrics
- **Programs offered** with details
- **Success stories** from beneficiaries
- **Donation options** with impact levels
- **Volunteer opportunities** 
- **Annual report** highlights
- **Ways to get involved**

## Quality Checklist for Generated Content

Before generating content, ensure:

- [ ] **Word count meets minimum** for page type
- [ ] **Specific details** instead of generic placeholders
- [ ] **Multiple sections** (5+ for landing pages)
- [ ] **Compelling headlines** that grab attention
- [ ] **Benefits-focused** copy (not just features)
- [ ] **Call-to-actions** in multiple places
- [ ] **Social proof** elements (testimonials, stats)
- [ ] **Visual hierarchy** with varied text sizes
- [ ] **Emotional connection** through storytelling
- [ ] **Professional tone** appropriate for industry
- [ ] **SEO-friendly** content with keywords
- [ ] **Scannable format** (headings, bullets, short paragraphs)
- [ ] **Contact information** (where relevant)
- [ ] **Trust indicators** (guarantees, certifications)
- [ ] **No Lorem Ipsum** or obvious placeholders

## Final Reminder

**The goal is to generate websites that look and feel like real, production-ready businesses that could launch today and start taking customers.**

Every page should:
- Tell a complete story
- Provide real value to visitors
- Drive business objectives
- Look professional and polished
- Require minimal editing to go live

**Think: "Could this website actually convert customers and make money?" If not, add more content!**
