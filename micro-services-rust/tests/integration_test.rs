use actix_web::{test, web, App};
use hello_actix::{handlers, create_pool};
use serde_json::json;
use sqlx::PgPool;

/// Initializes the test database by cleaning up the Sample table.
/// If `with_data` is true, then inserts a single test record.
async fn init_test_db(with_data: bool) -> PgPool {
    let pool = create_pool().await;
    
    // Clean up existing data in the "Sample" table
    sqlx::query(r#"TRUNCATE TABLE "Sample" RESTART IDENTITY CASCADE"#)
        .execute(&pool)
        .await
        .expect("Failed to clean up test data");
    
    if with_data {
        // Insert test data
        sqlx::query!(r#"
            INSERT INTO "Sample" (name)
            VALUES ($1)
        "#, "Test Sample")
        .execute(&pool)
        .await
        .expect("Failed to insert test data");
        
        // Verify insertion count equals 1
        let count = sqlx::query!(r#"SELECT COUNT(*) as count FROM "Sample""#)
            .fetch_one(&pool)
            .await
            .expect("Failed to count records");
        assert_eq!(count.count.unwrap(), 1, "Test data was not inserted correctly");
    }
    
    pool
}

/// Cleans up the test database by truncating the "Sample" table.
async fn cleanup_test_db(pool: &PgPool) {
    sqlx::query(r#"TRUNCATE TABLE "Sample" RESTART IDENTITY CASCADE"#)
        .execute(pool)
        .await
        .expect("Failed to clean up test data");
}

#[actix_rt::test]
async fn test_health_check() {
    let app = test::init_service(
        App::new()
            .service(handlers::health_check)
    ).await;
    
    let req = test::TestRequest::get()
        .uri("/health")
        .to_request();
    
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    // Check that the health check returns "OK"
    assert_eq!(test::read_body(resp).await, "\"OK\"");
}

#[actix_rt::test]
async fn test_get_sample() {
    // Initialize test database with initial data inserted
    let pool = init_test_db(true).await;
    
    // Verify initial data via a direct DB query
    let sample = sqlx::query!(r#"SELECT name FROM "Sample" LIMIT 1"#)
        .fetch_one(&pool)
        .await
        .expect("Failed to fetch test data");
    assert_eq!(sample.name, "Test Sample", "Test data is incorrect");
    
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(handlers::get_sample)
    ).await;
    
    let req = test::TestRequest::get()
        .uri("/samples/Test%20Sample")
        .to_request();
    
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    
    let body: serde_json::Value = test::read_body_json(resp).await;
    assert_eq!(body["name"], "Test Sample");
    
    cleanup_test_db(&pool).await;
}

#[actix_rt::test]
async fn test_create_sample() {
    // Initialize test database without initial data
    let pool = init_test_db(false).await;
    
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(handlers::create_sample)
    ).await;
    
    let new_sample = web::Json(json!({
        "name": "Test Sample"
    }));
    
    let req = test::TestRequest::post()
        .uri("/samples")
        .set_json(&new_sample)
        .to_request();
    
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    
    let body: serde_json::Value = test::read_body_json(resp).await;
    assert_eq!(body["name"], "Test Sample");
    
    cleanup_test_db(&pool).await;
}

#[actix_rt::test]
async fn test_get_samples() {
    // Initialize test database with initial data inserted
    let pool = init_test_db(true).await;
    
    // Verify that one record exists in the DB
    let samples = sqlx::query!(r#"SELECT name FROM "Sample""#)
        .fetch_all(&pool)
        .await
        .expect("Failed to fetch test data");
    assert_eq!(samples.len(), 1, "Test data is incorrect");
    
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(handlers::get_samples)
    ).await;
    
    let req = test::TestRequest::get()
        .uri("/samples")
        .to_request();
    
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    
    let body: serde_json::Value = test::read_body_json(resp).await;
    assert_eq!(body[0]["name"], "Test Sample");
    
    cleanup_test_db(&pool).await;
}