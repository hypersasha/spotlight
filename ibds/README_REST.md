**Получение массива всех работающих комнат**
----
  Сделав этот запрос, можно получить список всех активных комнат.

* **URL**

  /rooms

* **Method:**

  `GET`
  
*  **URL Параметры**
 
   Нет

* **Body параметры**

  Нет

* **Success Response:**

  * **Content:** 
  ```json
    [
      {
        "id": "6y32wmza",
        "track": {
            "track_values": [
                1,
                2,
                3,
                4,
                5
            ],
            "tact": 0,
            "track_id": 1,
            "playerInterval": null
        },
        "title": "Русские",
        "description": "Вперед",
        "users": [
            "wOmkgadJyKIQmEmlAAAD"
        ]
    }
  ]
    ```
 
* **Error Response:**

  Нет
    ```
