# SANTEX: NodeJS Backend Test

_Note:_ I forgot to do with GraphQL. But if needed, just ask me and I'll add it (using Apollo)

- The code is available at: `https://github.com/hpandelo/santex-be-test` (Private repo). You can request access if needed

## How to Run:

- Just run: `docker compose up -d`
- Observe the logs, It will import the data automatically at startup and will take some minutes due to API Rate Limits

## DOCKER AND DOCKER COMPOSE

- If you like to see the data getting imported always, just comment the line 27 and 28 of `docker-compose.yaml`

```diff
 -  volumes:
 -   - redis:/data
 +  // volumes:
 +  // - redis:/data
```

- In `Dockerfile` you'll see that I'd prefer to use the bind mount instead of Copy the whole data to the image, It prevent the image to contains the pure source code that won't be used

- _Note:_ I prepared for prod env too into the multi stage, but haven't too much time setting up it. It's just to show up the options

## DB

- Redis: Decided by Redis due to the easy complexity of the operations and to be the fastest option in this case
- MongoDB: was also considered, but I decided to simplify (as I said, it was done almost 5AM)

## PATTERNS

- **Modular Entities**: To add or remove an entity completely, you'll need to change only few files
- **Clean Code**: Meaningful names in classes, methods, functions
- **Factory with Singleton**: Prevent multiple instances of services, savig some memory allocations
- **Dependency Inversion**: All the external dependencies are instantiated in Factories and passed in constructors
  - You can see the biggest advantage of this pattern in `football-data.service.spec.ts` in `mockAxiosInstance`. I could simply create a normal variable with the `jest.fn()` function withou the need to struggle to mock the real package
- **POO**: I'd prefer to keep the code mantainable for long time, but created the `./src/services/preloader/index.ts` to show that I also know how to use in the functional way
- **YAGNI + KISS**: The reason I haven't created the whole Interfaces at this moment =P

_Note:_ Normally, we can abstract a lot more, by creating the Interfaces (like `CacheService` instead of calling directly as `RedisService`) but I did it from 2:00AM to 5:00 AM and after doing some other challenges in Codility platform

## PERFORMANCE

- Mandatory external calls (async) without dependencies are grouped
- I would retrieve the teams in a better way, but I faced a lot of HTTP403 responses, so I decided to retrieve from the competitions instead

_Note:_ I'd like to retrieve data from API as _on-the-go_ instead to retrieve everything when the application is starting (doing by controller calls)

## CODE QUALITY

- Husky
  - `"pre-commit": "lint-staged"` Prevent commit without passing by linter
  - `"pre-push": "npm run test:ci"` Prevent pushing code breaking tests (I also like to use the `test:staged` to be faster when CI will also run the tests)
  - `commit-msg`: Using Commitlint to get a semantical/conventional commits. Check: https://www.conventionalcommits.org/en/v1.0.0/#summary
    _Note:_ Won't work without git, so the .zip files will need to be in a repository to have all those effects

## UNIT TESTING

_Note¹:_ I convered only the services just for you to understand how I do it

_Note²:_ Missing Integration Tests. But normally, I'll be testing the endpoints of each entity module and some common operations

### General Setup

- Default pattern on filenames:
  - `.spec.ts` for **Unit Tests**
  - `.test.ts` for **Integration / E2E Tests**
- Threshould: Set as 40 just for the this example. Normally I'll be increasing as the tests are getting created. My target is 80+

### Coverage

- All codes must be in /src, so I'd set the coverage to collect inside it
- Index files must only have exports. There's no need to collect coverage of them
- Reporters:
  - Nobody really uses the `lcov`, it's just defualt. So, IMHO, `html` is enought
  - Text: `['text', {skipFull: true}]` is to always remember where to add coverage (like walking with a stone in the shoes)
  - `text-summary` This one, I also like to add into the PR template. To keep tracking the UTs beign added


## ABOUT ME
- LinkedIn: https://www.linkedin.com/in/helciomacedo/
- Github: https://github.com/hpandelo
- This project: https://github.com/hpandelo/santex-be-test (Private Repo)

```markdown
I'm an experienced software engineer, focusing currently in the backend with NodeJS but also worked (almost all my career) as Fullstack, with huge experience in all software and company sizes, from PoC (Proof of Concept) to Global Wide Software
* Self-taught, passionate to learn & teach
* Mentor, Tech Lead & Team Supporter
* Looking for a company that helps me to grow up in my career while I help to grow up the company
* Standing for a long-term partnership  
* Ready to be a contractor via worldwide B2B (Business-to-Business)/C2C (Corp-to-Corp) contracts
* Ready to Start Immediately 
* Ready to work in an overlap of any timezone

 Before 2015
- PHP + C++ + MySQL in Ragnarok Online Server
- PHP + MySQL for small & mid size companies websites
- PHP + MySQL & Prestashop for eCommerces

After 2015 (When I consider to have started the professional career)
- JACTO
    - Machine to Machine Communications
    - Proof of Concepts
    - Small Internal Apps
    - AWS, Zigbee, Java, NodeJS, AngularJS and Angular 2, Bootstrap

- DAITAN
    - Acting as tech lead
    - Mentoring and Onboarding
    - Interviewers
    - Experience with global wide software
    - 8x8 Virtual Contact Center with PHP + Oracle + Java + Pure (Vanilla) Javascript
    - SS8 Lawful Enforcement Solutions with Java + GWT

- META IT - KraftHeinz
    - Social Network
    - Tech Lead
    - NodeJS + NestJS + PostgreSQL + Contentful CMS
```
