# Arabic Mission database template

`ArabicMission_Database_Template.xlsx` adalah template kosong untuk diimpor ke Google Sheets. Template berisi empat tab:

| Tab | Kegunaan |
|---|---|
| `Users` | Akun, email, password hash/salt, role, status, waktu pembuatan dan login terakhir. |
| `UserProgress` | Satu snapshot progres per pengguna, termasuk XP, misi selesai, dan JSON progres. |
| `MissionResults` | Hasil setiap misi yang sudah diselesaikan. |
| `ActivityLogs` | Log registrasi, login, dan penyimpanan progres. |

Apps Script `apps-script/Code.gs` juga dapat membuat atau memperbaiki header tab tersebut melalui fungsi `setupDatabase()`.

**Jangan mengunggah spreadsheet database aktif yang berisi data pengguna ke GitHub.** Yang boleh masuk repository hanya template kosong ini dan kode aplikasi.
