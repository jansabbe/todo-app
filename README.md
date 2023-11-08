# todo-app

A code kata on testing webapps

## Setup

- [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=569916645&machine=premiumLinux&devcontainer_path=.devcontainer%2Fdevcontainer.json&location=WestEurope)
- You will need to wait a bit until `npm install` finishes
- Run `npm start` in the integrated terminal. This starts both the 'backend' server (port 8001) and the frontend (port
  3000).
  In the ports tab you can open the app in the browser. ![Ports tab in VSCode](docs/assets/ports.png?raw=true)

Alternatively you can also set up the project locally:

- Make sure NodeJS 20.9.0 has been installed. You can also use [nvm](https://github.com/nvm-sh/nvm) and
  execute `nvm install` and `nvm use`.
- Execute `npm install`
- You can then execute `npm start` to run backend server (port 8001) and frontend (port 3000) locally.

## Application

![Screenshot of Todo Application](docs/assets/application.png?raw=true)

The application allows you to create todos, mark them as done, delete them and see how many todos are left.

## Exercises

### 1. Get familiar with Vitest

To write our unit tests, we will be using [Vitest](https://vitest.dev/). This is a unit testing framework for
JavaScript/TypeScript.

![Close-up of Add Todo](docs/assets/add-todo-closeup-empty.png?raw=true)

Notice how the "Add" button is disabled when the description is empty. It remains empty if the user enters whitespace. It also
gets disabled when the user enters more than 100 characters in the description.

This logic is done in the `isValid` function in `src/components/add-todo/validate.ts`.

Create tests in `src/components/add-todo/validate.test.ts`:

> _Note:_ Tests are typically co-located with the actual implementation and end in `.test.ts(x)` or `.spec.ts(x)`.

- when passing an empty string, `isValid` should return false
- when passing a string with just whitespace, `isValid` should return false
- when passing a string with text, `isValid` should return true
- when passing a string with 100 characters, `isValid` should return false. (Tip, in JavaScript you can create such a string using `Array(100).fill('a').join('')`)
- when passing a string with more than 100 characters `isValid` should return false

Keep the [expect documentation](https://vitest.dev/api/expect.html) and [vitest api documentation](https://vitest.dev/api/) handy.

To execute the tests run `npm test`. This will start Vitest in "watch" mode. Whenever you save a file, the tests will
run. Press `h` to explore the watch mode

- try only watching the `validate.test.ts` file
- try focusing on a single test
- switch back to running all tests
- read the docs on [debugging](https://vitest.dev/guide/debugging.html) and step through the test in your favorite IDE
- try using [test.each](https://vitest.dev/api/#test-each) to simplify your tests

### 2. Test builders

![Close-up of number of todos left](docs/assets/footer-closeup-items.png?raw=true)

At the bottom of the todo app you will see the number of todos that are left. As you toggle todos, this number will
change. The number is calculated in the `countTodosLeft` function (in `src/components/footer/count.ts`). It takes 
an array of todos and returns how many todos are still left.

Create tests in `count.test.ts`:

- when passing an empty array, `countTodosLeft` should return 0
- when passing an array where all todos are done, `countTodosLeft` should return 0
- when passing an array where 1 todo is done and 2 are not done, `countTodosLeft` should return 2
- ...

A todo looks as follows:

```ts
const todo = {
    id: "3044efbc-7e54-4751-a96c-e01474caf8a7",
    description: "Jog around the park",
    done: false,
};
```

To generate ids and descriptions you can use [faker](https://fakerjs.dev/). Check out the 
[api documentation](https://fakerjs.dev/api/) to see what it can do

```ts
import {faker} from "@faker-js/faker";

const id = faker.string.uuid();
```

You might also want to create a test builder to easily create todos. A pattern you can use in JavaScript/TypeScript is
based on the [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) syntax.

```ts
function anAddress(overrides: Partial<Address> = {}): Address {
    return {
        street: faker.location.street(),
        zipCode: faker.location.zipCode("####"),
        city: faker.location.city(),
        ...overrides,
    };
}

const randomAddress = anAddress();
const addressInTheCity = anAddress({zipCode: "2000"});
```

> _Note:_ You can keep the test-builder in the test file, or put it in a separate test-builders file in `src/test-lib`.

### 3. Testing Library

![Close-up of "All done" footer](docs/assets/footer-closeup-all-done.png?raw=true)

You might notice that the application shows

- "All done!" when there are no todos left
- "1 todo left" when there is one
- "4 todos left" when there are multiple

Write some tests in `footer.test.tsx` to cover these cases. This time the functionality is in a React component. We can
use [testing-library](https://testing-library.com/) to render a React component in our tests.

> _Note:_ Testing-library also works on regular DOM applications, and with other frameworks (Vue, Angular,..)

Import `screen` and `render` from our test-lib. In a test you can render the Footer component with an array of todos.

```tsx
import {screen, render} from "../../test-lib/test-utils";

test("show todos", () => {
    const exampleTodos = [aTodo({done: true})];
    render(<Footer todos={exampleTodos} />);
});
```

> _Note:_ Wondering why we import from test-lib/test-utils instead of @testing-library/react?
> This [setup](https://testing-library.com/docs/react-testing-library/setup) is recommended to reduce certain
> boilerplate code.

Use the [testing-library queries](https://testing-library.com/docs/queries/about) to find the DOM element. Unsure which
query would work best? Try putting `screen.logTestingPlaygroundURL()` after the `render` method and go to the url.

- Make sure you understand the difference between `getBy..`, `queryBy..` and `findBy..`.

These queries return DOM elements which you might want to assert. (is it present, is a button disabled, ...).
Go over [jest-dom](https://github.com/testing-library/jest-dom) to see what matchers can help you.

> _Note:_ Aren't we running these tests in NodeJS? How can we render DOM elements without a browser?
> We're testing against a _fake_ implementation of the DOM called [jsdom](https://github.com/jsdom/jsdom).
> It can't implement/simulate everything, but works great for these tests.

### 4. Simulating the user

https://user-images.githubusercontent.com/648689/203807478-97b14d45-4712-4bcc-980b-95f4d5a440bc.mov

After a user adds a todo, we clear the "Description" field to allow the user to quickly add a new todo.

Create tests in `add-todo.test.tsx`:

- user types something in 'Description', presses enter: description should become empty
- user types something in 'Description', clicks the add button: description should become empty

Just like in the previous exercise, we can use testing-library to find and verify the DOM elements. This time we also
want to trigger DOM events to simulate the user. However we want to avoid coupling our test to a specific choice in the
implementation.
In the test, we don't care if the component is using `onChange`/`onKeyDown`/`onKeyUp`/`onSubmit`/...

We'll use [user-event](https://testing-library.com/docs/user-event/intro/) instead. It will simulate all the correct DOM
events when simulating a user action. The `render` function from `test-lib/test-utils` has been setup to return a userEvent
object.

```tsx
test("user hovers over a button", async () => {
    const {user} = render(<AddTodoForm />);
    const coolButton = screen.getByRole("button", {name: /my cool button/i});
    await user.hover(coolButton);
});
```

> _Note_: the methods on `user` return promises, you will need to `await` them.

### 5. Faking the backend

https://user-images.githubusercontent.com/648689/203825624-793471e2-896a-4095-b0f5-ce1271b849b9.mov

When the user adds a todo in the `<AddTodoForm>` component (doing a `POST` to `/api/todos`), the `<TodoList>` will show
this new todo.
A user can then mark the todo as done or delete it. We would like to test if this actually happens:

Create tests in `src/app.test.tsx`:

- user types something in the description and clicks add. The todo shows up in the list.
- start off with a single todo item in the list. When the user marks it as done, the footer should show 'All done!'
- start off with a single todo item in the list. When the user deletes it, the text 'Add some todos' should show up

The components we are testing are executing REST calls. Luckily we are not testing against the real backend.
In `src/test-lib/test-server.ts` [msw](https://mswjs.io/) is being used to [fake](https://martinfowler.com/bliki/TestDouble.html) 
our backend. In `src/setupTests.ts` we make sure that we cleanup after every test.

Extra tips:

- Before rendering, call `resetTodos` to start the test with a specific todo item. This way you don't have to add it
  through the UI in every test.
- We are missing a call for removing todo items. Make sure the test-server also implements `DELETE /api/todos/:todoId`.
  Currently our web-app always requires a JSON response. HTTP reponses without a body are not supported.
- Even if the server is fake, the results won't be "instant". The `await screen.findBy`-queries will come in
  handy. [docs](https://testing-library.com/docs/dom-testing-library/api-async/)
- You can scope testing-library queries using `within`. (eg, `within(list).getBy...`)
- The todo items have a trash icon, but it does have accessible text so it is still easy to find. A UI that is not
  accessible, will be hard to test.

### 6. Stubbing the backend

![Close-up of Add todo form with error message](docs/assets/add-todo-closeup-error.png?raw=true)

Disabling the 'Add' button when the user types more than 100 characters isn't great UX. Instead we will
show an explicit error message, coming from the backend. 

- Remove the "less than 100 characters"-check from `components/add-todo/validate.ts`. Update/remove any relevant failing tests 

We could expand the fake test-server implementation to return an error. However that can lead to an overly
complex fake implementation. Instead we will temporarily replace an endpoint with a
stub in our tests. The `POST /api/todos` should return a `400` status code and a json response
that looks like this `{"code":"description_too_long","errorMessage":"Description may not be more than 100 characters"}`

Create tests in `add-todo.test.tsx`:

- given the user adds a todo, when the server returns an error, then the error message shows up
- given the user adds a todo, when the server returns an error, then description input text is not cleared

You can temporarily override a call by calling `mswServer.use()`. These overrides are cleaned up after each test (
see `src/setupTests.ts`).

For example

```ts
import {http} from "msw";
import {mswServer} from "../../test-lib/test-server";

test("my test", () => {
    mswServer.use(
        http.get('/api/todos', ({request}) => {...
        })
    ); // similar to `test-server.ts`
...
})
```

### 7. Mocking the backend

![Close-up of Add Todo](docs/assets/add-todo-closeup-empty.png?raw=true)

We would like to verify if the `Add` button actually calls the backend. Does it do a `POST` with the correct parameters?

Create tests in `add-todo.test.tsx`:

- when the user adds a todo, a `POST` call is done to `/api/todos` with `{"description":"..."}` in the body.

[Vitest](https://vitest.dev/guide/mocking.html) allows us to create and verify mock functions. We can combine this with
the previous exercise to verify a call was executed.

```ts
const postCall = vitest.fn();
mswServer.use(
    http.get('/api/todos', ({request}) => {
        // use postcall
    })
);
...
expect(postCall).toHaveBeenCalledWith({description: expectedDescription})
```

### Bonus rounds

![Screenshot of "Something broke" error screen](docs/assets/error-screen.png?raw=true)

- when the GET call to `/api/todos` fails, a message should show up with "Something broke".
- when toggling a todo item, a `checked` css class should be applied to the todo item.
- when toggling a todo item, the checkbox is checked optimistically. However if the `PUT` call fails, the todo item
  should be unchecked
- while adding a todo, the 'Add' button should be disabled and show 'Adding...'. You might need
  to [delay](https://mswjs.io/docs/api/context/delay) the server to verify this.
- create a helper method `mockHandler` that takes a `Mock<any, any>` and returns
  a `ResponseResolver<RestRequest, RestContext>` to easily mock REST calls:
  For example:

```ts
const postCall = jest.fn().mockReturnValue({id: 3});
mswServer.use(http.post("/api/contacts", mockHandler(postCall)));
// ...
expect(postCall).toHaveBeenCalledWith({name: "Burt"});
```
