### Menu - Example Raydiant App

Easily create and display customized menus.

#### Presentation Properties

| Name                                | Type     | Description                  |
| ----------------------------------- | -------- | ---------------------------- |
| `categories`                        | `array`  | The categories to render.    |
| `├── category`                      | `string` | The name of the category.    |
| `└── items`                         | `array`  | The items to render.         |
| &nbsp;&nbsp;&nbsp;&nbsp;`├── item`  | `string` | The name of the item.        |
| &nbsp;&nbsp;&nbsp;&nbsp;`└── price` | `string` | The price of the item.       |
| `duration`                          | `number` | The display time in seconds. |

#### Commands

The following commands can be run from the project directory.

* `npm start`: Run the local simulator
* `npm run build`: Build the app for deployment
* `npm run deploy`: Deploy the app to the dashboard
* `npm run static`: Build the app with the simulator
* `npm run deploy-static`: Deploy the static build to netlify
