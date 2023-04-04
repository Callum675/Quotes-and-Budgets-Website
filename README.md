# Quotes and Budgets

# Requirements

- Git
- Node
- MongoDB

# Automatic Installation - Ubuntu Linux

- Clone repo from github
- chmod +x setup.sh
- ./setup.sh
- Follow setup process

\*If any issues ocur doing Automatic Installation refer to manual installation process

# Manual Installation

- Ensure required software is installed from given requirements
- Clone repo from github
- Create .env file from given .env.example
- host a local mongoDB database
- Run command: npm run install-all
- Run command: npm run dev

# The MoSCoW functional requirements for this website are as follows:

The website must:

- Allow users to enter information for processing in terms of time periods of work (e.g. “man hours”). Allow at least 1 worker for each project
- Define hourly (or daily) rates for the workers
- Calculate a final budget figure using some sensible function (described below)
- Display some information on how the final budget figure was calculated (although this should not be entirely transparent, see “Fudge Factor” below)

The website should:

- Allow users to access their own user accounts
- Allow users to save and delete quotes. This should use a database.

The website could:

- Allow users to change existing quotes
- Have additional (dynamic) functionality for adding non-human resources to the calculation
- Have different pay grades for selection (e.g. “subject expert”, “casual worker”)
- Keep the hourly (or daily) rates private from users (i.e. users should not be able to directly see a worker’s hourly rate, and the “fudge factor” should stop them from easily reverse-engineering the cost)

It would be nice if the website would:

- Incorporate sub-tasks for the project quote and give intermediate figures for those
- Combine quotes
- Allow an administrator to make changes to the pre-set pay grades
- Allow an administrator to calculate a quote without the fudge factor

# How to calculate the final budget figure

The basic formulae for calculating a figure for the cost of each person (a human resource) is:
Cost_per_person = Number_of_hours_needed x persons_hourly_rate
The above uses hours, but you could use days or weeks or months instead. For simplicity, you can assume that a “junior” earns ~£20k (or ~£10 per hour), a “standard” earns ~£40k (or ~£20 per hour) and a senior earns ~£60k (or ~£30 per hour).
Physical resources can simply be added into the total as a one-off cost (e.g. buying a computer). Alternatively, they might be added in as a monthly or weekly cost (e.g. electricity bills).

# The “Fudge Factor”

If a company was to put a perfectly accurate quote generator online, then it would be really easy to reverse engineer. That is, anybody who has access to a complete and perfectly accurate quote generator could quickly work out individual salaries, which could be considered a risk to data privacy. And competitors could easily work out what they need to do beat the quote. Preventing this is where the “fudge factor” comes into play. The fudge factor is a random number (sensible values could be between 0.5 and 1.5) that multiplies something in the quote. The fudge factor could multiply the hourly rate or the number of hours or the cost of each person. It could be randomly decided once and then used consistently ever after, or simply randomly selected whenever it is required in a calculation. The idea is to prevent reverse engineering of the quote (and this includes reverse engineering by looking at source code using the developer tools in a browser).
