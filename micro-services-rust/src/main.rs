use hello_actix::run;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    run().await
}