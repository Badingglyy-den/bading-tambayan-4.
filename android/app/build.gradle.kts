plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.badingtambayan.chatheads"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.badingtambayan.chatheads"
        minSdk = 26
        targetSdk = 33
        versionCode = 1
        versionName = "1.0.0"
    }
}
