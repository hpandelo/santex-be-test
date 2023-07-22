## DB
  - Redis: Decided by Redis due to the easy complexity of the operations and to be the fastest option in this case
  - MongoDB: was also considered, but I decided to simplify (as I said, it was done almost 5AM)


## PATTERNS
  - **Modular Entities**: To add or remove an entity completely, you'll need to change only few files
  - **Clean Code**: Meaningful names in classes, methods, functions
  - **Factory with Singleton**: Prevent multiple instances of services, savig some memory allocations
  - **Dependency Inversion**: All the external dependencies are instantiated in Factories and passed in constructors
    - You can see the biggest advantage of this pattern in `football-data.service.spec.ts` in `mockAxiosInstance`. I could simply create a normal variable with the `jest.fn()` function withou the need to struggle to mock the real package

  *Note:* Normally, we can abstract a lot more, by creating the Interfaces (like `CacheService` instead of calling directly as `RedisService`) but I did it from 1:00AM to 5:00 AM

## PERFORMANCE
  - Mandatory external calls (async) without dependencies are grouped
  - I would retrieve the teams in a better way, but I faced a lot of HTTP403 responses, so I decided to retrieve from the competitions instead

  *Note:* I'd like to retrieve data from API as *on-the-go* instead to retrieve everything when the application is starting (doing by controller calls)

## CODE QUALITY
  - Husky
    - `"pre-commit": "lint-staged"` Prevent commit without passing by linter
    - `"pre-push": "npm run test:ci"` Prevent pushing code breaking tests (I also like to use the `test:staged` to be faster when CI will also run the tests)


## JEST

### General Setup
  - Default pattern on filenames:
    - `.spec.ts` for **Unit Tests**
    - `.test.ts` for **Integration / E2E Tests**

### Coverage
  - All codes must be in /src, so I'd set the coverage to collect inside it
  - Index files must only have exports. There's no need to collect coverage of them
  - Reporters:
    - Nobody really uses the `lcov`, it's just defualt. So, IMHO, `html` is enought
    - Text: `['text', {skipFull: true}]` is to always remember where to add coverage (like walking with a stone in the shoes)
    - `text-summary` This one, I also like to add into the PR template. To keep tracking the UTs beign added

##
