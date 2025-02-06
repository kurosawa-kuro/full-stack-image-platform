// // CREATE TABLE "Sample" (
//     name VARCHAR(255) NOT NULL
// );

use actix_web::{get, post, web, App, HttpServer, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::env;
use dotenv::dotenv;
use serde_json::json;

//------------------------------------------------------------------------------
// データモデル定義
//------------------------------------------------------------------------------

/// サンプルのデータモデル
#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Clone)]
pub struct Sample {
    pub name: String,
}

/// 新しいカテゴリのデータモデル
#[derive(Serialize, Deserialize, Clone)]
pub struct NewCategory {
    pub name: String,
}

//------------------------------------------------------------------------------
// データベース設定
//------------------------------------------------------------------------------

/// データベース接続プールを生成する
pub async fn create_pool() -> PgPool {
    // 環境変数(.env)の読み込み
    dotenv().ok();

    // DATABASE_URL の取得
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    // 接続プールの生成
    let pool = PgPool::connect(&database_url)
        .await
        .expect("Failed to create pool");

    // シンプルな接続確認クエリ
    match sqlx::query("SELECT 1").execute(&pool).await {
        Ok(_) => println!("Database connection successful"),
        Err(e) => eprintln!("Failed to connect to database: {}", e),
    }

    pool
}

/// SQLxのエラーをHTTPレスポンスへ変換する
fn handle_db_error(e: sqlx::Error) -> HttpResponse {
    eprintln!("Database error: {}", e);
    match e {
        sqlx::Error::RowNotFound => HttpResponse::NotFound().json("Resource not found"),
        _ => HttpResponse::InternalServerError().json("Internal server error"),
    }
}

//------------------------------------------------------------------------------
// ハンドラーモジュール
//------------------------------------------------------------------------------

pub mod handlers {
    use super::*;

    /// ヘルスチェック用ハンドラー
    #[get("/health")]
    pub async fn health_check() -> impl Responder {
        HttpResponse::Ok().json("OK")
    }

    /// サンプル情報1件取得ハンドラー
    #[get("/samples/{name}")]
    pub async fn get_sample(
        pool: web::Data<PgPool>,
        name: web::Path<String>
    ) -> impl Responder {
        let sample = sqlx::query!(
            r#"SELECT name FROM "Sample" WHERE name = $1"#,
            name.into_inner()
        )
        .fetch_one(&**pool)
        .await;

        match sample {
            Ok(sample) => HttpResponse::Ok().json(json!({ "name": sample.name })),
            Err(_) => HttpResponse::NotFound().json("Sample not found")
        }
    }

    /// サンプル作成ハンドラー
    #[post("/samples")]
    pub async fn create_sample(
        pool: web::Data<PgPool>,
        new_sample: web::Json<Sample>
    ) -> impl Responder {
        sqlx::query_as!(
            Sample,
            r#"
            INSERT INTO "Sample" (name)
            VALUES ($1)
            RETURNING name
            "#,
            new_sample.name
        )
        .fetch_one(&**pool)
        .await
        .map(|sample| HttpResponse::Created().json(sample))
        .unwrap_or_else(handle_db_error)
    }

    /// サンプル情報一覧取得ハンドラー
    #[get("/samples")]
    pub async fn get_samples(pool: web::Data<PgPool>) -> impl Responder {
        let samples = sqlx::query!(r#"SELECT name FROM "Sample""#)
            .fetch_all(&**pool)
            .await;

        match samples {
            Ok(samples) => {
                let list = samples
                    .into_iter()
                    .map(|s| json!({ "name": s.name }))
                    .collect::<Vec<_>>();
                HttpResponse::Ok().json(list)
            },
            Err(_) => HttpResponse::InternalServerError().json("Failed to fetch samples")
        }
    }
}

//------------------------------------------------------------------------------
// アプリケーション起動
//------------------------------------------------------------------------------

/// アプリケーションを起動するエントリーポイント
pub async fn run() -> std::io::Result<()> {
    let pool = create_pool().await;

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(handlers::health_check)
            .service(handlers::get_sample)
            .service(handlers::create_sample)
            .service(handlers::get_samples)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}