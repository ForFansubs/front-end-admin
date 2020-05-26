module.exports = [
    {
        "title": "Ana yetkiler",
        "perms": {
            "Admin sayfasını görüntüle": "see-admin-page",
            "Kayıtları Görüntüle (Loglar)": "see-logs"
        }
    },
    {
        "title": "Anime",
        "main": "see-anime",
        "perms": {
            "Anime Ekle": "add-anime",
            "Anime Düzenle": "update-anime",
            "Anime Sil": "delete-anime",
            "Öne Çıkarılan Animeleri Düzenle": "featured-anime"
        },
        "subperms": [
            {
                "title": "Bölüm Ekleme",
                "main": "see-episode",
                "perms": {
                    "Bölüm Ekle": "add-episode",
                    "Bölüm Güncelle": "update-episode",
                    "Bölüm Sil": "delete-episode"
                }
            },
            {
                "title": "İzleme Linki Ekle",
                "main": "see-watch-link",
                "perms": {
                    "İzleme Linki Ekle": "add-watch-link",
                    "İzleme Linki Sil": "delete-watch-link"
                }
            },
            {
                "title": "İndirme Linki Ekle",
                "main": "see-download-link",
                "perms": {
                    "İndirme Linki Ekle": "add-download-link",
                    "İndirme Linki Sil": "delete-download-link"
                }
            }
        ]
    },
    {
        "title": "Manga",
        "main": "see-manga",
        "perms": {
            "Manga Ekle": "add-manga",
            "Manga Güncelle": "update-manga",
            "Manga Sil": "delete-manga"
        }
    },
    {
        "title": "Manga Bölüm",
        "main": "see-manga-episode",
        "perms": {
            "Manga Bölümü Ekle": "add-manga-episode",
            "Manga Bölümü Güncelle": "update-manga-episode",
            "Manga Bölümü Sil": "delete-manga-episode"
        }
    },
    {
        "title": "Bildirim",
        "main": "see-notification",
        "perms": {
            "Bildirim Ekle": "add-notification",
            "Bildirim Güncelle": "update-notification",
            "Bildirim Sil": "delete-notification"
        }
    },
    {
        "title": "Kullanıcı",
        "main": "see-user",
        "perms": {
            "Kullanıcı Ekle": "add-user",
            "Kullanıcı Güncelle": "update-user",
            "Kullanıcı Sil": "delete-user"
        }
    },
    {
        "title": "Rol",
        "main": "see-permission",
        "perms": {
            "Rol Ekle": "add-permission",
            "Rol Güncelle": "update-permission",
            "Rol Sil": "delete-permission"
        }
    },
    {
        "title": "Sistem",
        "main": "see-administrative-stuff",
        "perms": {

        }
    }
]