# Kılavuz: GitHub Pages ile Sıfır Maliyetli ve Sınırsız Canlıya Geçiş El Kitabı

Bu kılavuz, projenizi **tek bir kuruş bile harcamadan**, bulut derleme sürelerine takılmadan (sınırsız güncelleme hakkıyla) ve gelecekte **sunucu veya ödeme tuzağı yaşamadan** nasıl dünya çapında yayına alacağınızı adım adım anlatmaktadır. 

Bu rehberi bilgisayarınızda saklayabilir, raporlayabilir ve her yeni projenizde güvenle kullanabilirsiniz.

---

## 1. Mimarinin Çalışma Mantığı (Nasıl Sıfır Fatura?)

Normalde Vercel/Netlify kodunuzu bulutta derler ve bu süreleri sayar (aylık limit dolduğunda para ister). 
Bu yöntemde ise:
1. Derleme işlemini kendi bilgisayarınızda yaparız (`npm run build`). Bu işlem yerel CPU'nuzu kullandığı için **tamamen sınırsız ve ücretsizdir**.
2. Bilgisayarınızın ürettiği hazır web site dosyalarını (`dist` klasörü) GitHub'a yollarız.
3. GitHub, bu statik dosyaları dünya çapındaki sunucularına dağıtır. GitHub Pages'e kart bilgisi dahi girmediğimiz için **%0 fatura riski** vardır.

---

## ADIM 1: Kod ve Yönlendirme Hazırlığı (React Router 404 Düzeltmesi)

React gibi tek sayfalık uygulamalarda (SPA), kullanıcı sayfayı yenilediğinde veya doğrudan bir alt sayfaya gitmeye çalıştığında (`/dashboard` gibi), GitHub Pages bu sayfayı fiziksel olarak bulamaz ve `404 Not Found` hatası verir. Bu sorunu sıfır maliyetle çözmek için şu iki dosyayı ekliyoruz:

### 1. Dosya: `public/404.html` Oluşturma
Bu dosya, hatalı yönlendirmeleri yakalayıp ana sayfaya güvenli bir şekilde aktaracak.
* **[NEW]** Projenizin `public/` klasörünün içine `404.html` adında yeni bir dosya oluşturun ve içine şu kodu yapıştırın:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Yönlendiriliyor...</title>
    <script type="text/javascript">
      // Tek sayfalık uygulama (SPA) yönlendirme scripti
      var pathSegmentsToKeep = 0; // Eğer özel domain kullanmıyorsanız (alt klasör ise) burayı 1 yapın.
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

### 2. Dosya: `index.html` Güncellemesi
Ana sayfamızın en tepesine, gelen yönlendirme sinyali yakalayıp React Router'a iletecek minik bir kod ekliyoruz.
* Projenizin kök dizinindeki `index.html` dosyasını açın. `<head>` etiketinin hemen içerisine (örn. `<title>` etiketinin altına) şu script'i ekleyin:

```html
    <!-- SPA Routing Handler -->
    <script type="text/javascript">
      (function(l) {
        if (l.search[1] === '/' ) {
          var decoded = l.search.slice(1).split('&').map(function(s) {
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null,
              l.pathname.slice(0, -1) + decoded + l.hash
          );
        }
      }(window.location))
    </script>
```

---

## ADIM 2: `gh-pages` Paketi Kurulumu ve Yapılandırma

Derleme ve yükleme işlemlerini tek tuşla otomatikleştirmek için popüler ve güvenli `gh-pages` kütüphanesini projemize ekliyoruz.

### 1. Paketi Yükleme
Terminalinizi (PowerShell veya CMD) projenin olduğu klasörde açın ve şu komutu çalıştırın:
```bash
npm install gh-pages --save-dev
```

### 2. `package.json` Dosyası Güncellemesi
* Projenizin `package.json` dosyasını açın.
* `"scripts"` bloğunun içerisine şu iki yeni satırı ekleyin:

```json
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
```

* Ayrıca `package.json` dosyasının en üst seviyesine (yani birinci parantezin hemen altına) şu satırı ekleyin:
  *(Buradaki `kullanici-adiniz` sizin GitHub kullanıcı adınız, `depo-adiniz` ise oluşturacağınız GitHub reposunun adı olmalıdır. Eğer özel domain bağlayacaksanız bu adımı atlayabilirsiniz.)*

```json
  "homepage": "https://kullanici-adiniz.github.io/depo-adiniz",
```

### 3. `vite.config.ts` Güncellemesi
Eğer sitenizi varsayılan GitHub alt klasöründe yayınlayacaksanız, Vite'e dosyaları nereden okuyacağını söylemeliyiz.
* `vite.config.ts` dosyanızı açın ve `base` ayarını ekleyin:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Göreli yollar sayesinde otomatik olarak her klasörde ve domainde çalışır!
})
```

---

## ADIM 3: Projeyi GitHub'a Yükleme (İlk Kurulum)

Eğer projeniz henüz GitHub'da değilse, şu adımlarla ilk yüklemeyi yapın:

1. Tarayıcınızdan [github.com](https://github.com) adresine gidin ve yeni bir **Private (Gizli)** veya **Public (Açık)** repo oluşturun. Repoya isim verin (Örn: `creaizen-recovery`).
2. Bilgisayarınızdaki proje klasöründe terminali açıp şu komutları sırasıyla çalıştırın:

```bash
# Git'i başlat
git init

# Tüm dosyaları takibe al
git add .

# İlk kaydı oluştur
git commit -m "feat: initial commit for deployment"

# GitHub deposu ile yerel klasörü eşleştir (GitHub'ın size verdiği URL'yi yapıştırın)
git remote add origin https://github.com/kullanici-adiniz/depo-adiniz.git

# Kodu GitHub'a gönder
git branch -M main
git push -u origin main
```

---

## ADIM 4: Tek Komutla Canlıya Alma (Lokal Derleme ve Yayına Giriş)

Her şey hazır! Sitenizi ilk kez canlıya almak veya kodda bir değişiklik yaptığınızda güncellemek için terminalde sadece şu komutu çalıştırmanız yeterlidir:

```bash
npm run deploy
```

**Arka Planda Ne Olur?**
1. Bilgisayarınız otomatik olarak projeyi en optimize şekilde derler (`npm run build`).
2. Derlenen `dist` klasörü arka planda geçici bir `gh-pages` branch'ine aktarılır.
3. Bu klasör doğrudan GitHub'a push edilir.
4. GitHub Pages sitenizi **1-2 dakika içinde** tüm dünyada yayına alır!

Siteniz artık **`https://kullanici-adiniz.github.io/depo-adiniz`** adresinde aktiftir.

---

## ADIM 5: Özel Alan Adı (Custom Domain) Bağlama (Opsiyonel & $0)

Kendi alan adınızı (örn: `creaizen.com`) bağlamak isterseniz, GitHub Pages bunu tamamen ücretsiz yapar ve SSL sertifikasını da kendi sağlar:

1. GitHub'daki deponuzun ayarlarına (**Settings**) gidin.
2. Sol menüden **Pages** sekmesine tıklayın.
3. **Custom Domain** yazan alana kendi domaininizi (örn: `creaizen.com`) yazın ve **Save** butonuna basın.
4. Domain sağlayıcınızın (Örn: GoDaddy, Namecheap vb.) panelinde şu DNS kayıtlarını ekleyin:
   * **CNAME Kaydı:** `www` -> `kullanici-adiniz.github.io`
   * **A Kayıtları (IP adresleri):**
     * `185.199.108.153`
     * `185.199.109.153`
     * `185.199.110.153`
     * `185.199.111.153`
5. DNS yönlendirmesi tamamlandığında (yaklaşık 1-2 saat), GitHub Pages ayarlarında **Enforce HTTPS** seçeneğini işaretleyin. 
6. Siteniz artık kendi domaininiz üzerinden dünya standartlarında, tamamen güvenli ve ücretsiz olarak yayındadır!
