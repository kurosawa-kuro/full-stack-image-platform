
```
erDiagram
    images ||--o{ image_categories : "belongs_to"
    categories ||--o{ image_categories : "belongs_to"

    images {
        id integer PK
        image_url string
        created_at timestamp
        updated_at timestamp
    }

    categories {
        id integer PK
        name string
        created_at timestamp
        updated_at timestamp
    }

    image_categories {
        id integer PK
        image_id integer FK
        category_id integer FK
        created_at timestamp
        updated_at timestamp
    }
```





```
erDiagram
    users ||--o{ images : "投稿する"
    images ||--o{ image_categories : "belongs_to"
    categories ||--o{ image_categories : "belongs_to"

    users {
        id integer PK
        email string
        password string
        profile_image_url string
        created_at timestamp
        updated_at timestamp
    }

    images {
        id integer PK
        user_id integer FK
        image_url string
        created_at timestamp
        updated_at timestamp
    }

    categories {
        id integer PK
        name string
        created_at timestamp
        updated_at timestamp
    }

    image_categories {
        id integer PK
        image_id integer FK
        category_id integer FK
        created_at timestamp
        updated_at timestamp
    }
```