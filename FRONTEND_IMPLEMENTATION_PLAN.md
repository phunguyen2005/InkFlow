# InkFlow Public Library - Frontend Implementation Plan

Ngày: 2026-10-10. Trạng thái: chờ bạn duyệt trước khi viết application code.

Mục tiêu: kiểm chứng luồng discover -> evaluate -> read -> author bằng frontend có tương tác đầy đủ, dữ liệu giả lập nhất quán và hình ảnh cinematic editorial. Năm màn hình là ưu tiên hiện tại; sản phẩm có thể mở rộng sau. Studio là miền riêng trong modular monolith.

## A. Repository Assessment

### A1. Những gì đã kiểm tra

| Hạng mục | Kết quả thực tế |
|---|---|
| Working directory | `D:\College\04_Year_4\InkFlow_Project` |
| GitHub | https://github.com/phunguyen2005/InkFlow ; đã xác nhận qua GitHub connector |
| Git | `main`, clean trước khi tạo kế hoạch; upstream `origin/main`; commit local `ab16e87` |
| Tracked files | Chỉ có `README.md`; chưa có application code |
| Dependencies | Chưa có `package.json`, lockfile, Next.js, Tailwind hoặc test runner |
| UI/tokens/assets | Chưa có component, CSS token hay ảnh trong repo |
| Toolchain | Đã kiểm tra khả năng tìm Node/npm/Git trên máy; version và tính tương thích cần xác minh khi scaffold |
| Agent rules | Project instructions được cung cấp trong chat; không tìm thấy `AGENTS.md` ở các thư mục cha đã kiểm tra trên ổ D |
| Foundation | Năm file có sẵn ở workspace ChatGPT trước, chưa nằm trong repo đích |

Không suy ra remote đang có cùng commit chỉ từ upstream local. GitHub connector đã xác nhận danh tính repo; chưa fetch, push, commit hay tạo PR.

### A2. Nguồn đã đọc

- `README.md` trong repo đích: định hướng hệ sinh thái và modular monolith.
- `C:\Users\phuga\.codex\.chatgpt-projects\g-p-6ac728ece91c819193db061c943555ab\public-library-foundation\`: `AGENTS.md`, `design.md`, `screens.md`, `architecture.md`, `mock-contracts.md`.
- `PO_REQUIREMENT.md`: bản PRD v1.1 được đính kèm trước, hiện là phần Executive Summary/Product Identity, không phải toàn bộ PRD nghiệp vụ.
- `designmd.md`: bản thiết kế gốc, trạng thái proposed direction for validation.
- `Khám Phá Thế Giới Truyện.png`: đã xem trực tiếp; ảnh 1536x1024, chứa header, hero, genre strip, Trending và đầu New Releases.
- Master prompt mới: yêu cầu kế hoạch tiếng Việt, duyệt trước triển khai và bảy milestone.

Hai tài liệu nguồn và screenshot đang ở thư mục preview tạm. Sau duyệt, lưu bản sao tham chiếu vào `docs/reference/`, ghi nguồn; không sửa file synced hoặc bản gốc. Foundation được đưa vào repo và cập nhật các quyết định dưới đây bằng diff rõ ràng.

### A3. Skills và công cụ

- Đã tham khảo `vercel:knowledge-update`: kiểm tra tài liệu Next.js theo package thực tế trước khi viết code. Không áp dụng hướng dẫn provisioning vì giai đoạn này chỉ dùng mock.
- Khi sửa nhiều TSX components: dùng `vercel:react-best-practices` để rà soát ranh giới server/client và render.
- Khi tạo artwork: dùng `imagegen`, đọc skill trước lúc tạo. Ảnh đầu ra phải được xem và kiểm tra crop.
- GitHub connector dùng xác minh repo và đọc thông tin khi cần. Kế hoạch hiện tại không yêu cầu publish, deployment hoặc thay đổi GitHub.
- Chưa cần skill Supabase/database, AI agents, billing hay deployment. Chưa xây website trên dịch vụ khác vì repo Next.js local đã được chỉ định.

### A4. Mâu thuẫn và quyết định đề xuất để duyệt

| Vấn đề trong nguồn | Quyết định đề xuất |
|---|---|
| Screenshot có Rankings, Community, Sign in, Get Started; chỉ năm màn hình được đặc tả | `Rankings` liên kết `/explore?sort=trending`; Genres tới Explore. Ẩn Community/Sign in. Primary discovery CTA tới Explore. Studio hiển thị `Studio coming soon` dạng thông tin khi chưa có URL thật |
| `screens.md` yêu cầu Studio CTA nhưng chưa có đích | Giữ block nhận diện Studio cuối trang; chỉ bật CTA khi có URL được cung cấp. Không tạo route giả hoặc nút bấm vô tác dụng |
| Hero nguồn mô tả ba cột rời; cần bố cục immersive | Một hero không đóng khung, artwork làm nền toàn band; text và rail đặt vào vùng an toàn của ảnh. Giữ tương quan thị giác của reference, tránh ba card cạnh nhau |
| Chữ EXPLORE chiếm hầu hết hero nhưng InkFlow chỉ nhỏ trên nav | Wordmark/brand InkFlow phải hiện rõ trong viewport đầu; EXPLORE giữ vai trò display discovery, không biến trang thành landing page |
| `designmd.md` có negative tracking và `vw`; foundation vẫn cho micro-label tracking | Dùng `letter-spacing: 0`, size theo token/breakpoint cố định và kiểm tra fit. Điều chỉnh nhịp/cột trước khi giảm type; không scale theo viewport |
| `architecture.md` minh họa `tailwind.config.ts` kiểu cũ | Đề xuất Tailwind 4 với CSS theme variables, giữ nguyên giá trị token. Xác minh exact stable package versions trước cài, ghi lockfile |
| `newest` đang dùng `lastPublishedAt`, trùng `latest` | Bổ sung `firstPublishedAt`; `newest` dựa vào lần công bố đầu, `latest` dựa vào chương mới nhất |
| Nocturne có `chapterCount: 34`, ví dụ chỉ ba chương; yêu cầu ít nhất năm | Chuẩn hóa fixture ban đầu thành năm chương/story, 100 chương truy cập được; counts/latest/author totals tính từ fixture. Giữ tên ba chương đã có, bổ sung hai chương |
| Author Mira có count nhưng `works: []` | Sinh works bằng `author.id`, tính totals từ các works và chapters; không lưu số liệu tách rời |
| Chỉ có một StorySummary đầy đủ, 19 truyện là seed | Giữ nguyên 20 title/slug/author/genre/status/provenance/synopsis; điền metadata còn thiếu có kiểm soát trong M1 |
| Mock label chỉ nằm nội bộ có thể bị hiểu thành dữ liệu thật | Hiển thị `Demo catalog`, metrics có nhãn `Sample ratings`, follow/save là `Saved on this device`; không có badge xác thực |
| Nguồn cũ yêu cầu prototype ba màn hình trước, prompt mới yêu cầu bảy milestone | Theo thứ tự milestone mới, vẫn lấy feedback thị giác sớm ở M2 và trải nghiệm đọc ở M5 |
| Token muted/subtle không bảo đảm contrast trên mọi surface | Đo từng cặp thực tế; nếu fail thì dùng token text sáng hơn cho vai trò đó; không tự đổi bảng màu toàn cục |

Các quyết định này là đề xuất trong kế hoạch, chưa chỉnh foundation hoặc application code. Phê duyệt kế hoạch bao gồm các điều chỉnh trên; điểm nào bạn đổi sẽ được cập nhật trước triển khai.

## B. Frontend Architecture Plan

### B1. Stack và dependency budget

Next.js App Router + React + TypeScript strict + Tailwind, npm lockfile. Chọn phiên bản stable tương thích tại thời điểm M1, pin phiên bản đã kiểm tra; không mặc định canary. Dùng Lucide cho icon, thư viện Markdown đã có cơ chế render an toàn như `react-markdown`, và primitive dialog có keyboard/focus management khi cần. Vitest cho domain logic; Playwright và axe cho browser checks.

Không cần global store, query cache, carousel/animation framework hay HTTP API giả để lọc 20 truyện. Server pages gọi repository trực tiếp. Domain interface giữ đường chuyển sang backend sau này; adapter không giả lập bảo mật backend.

### B2. Cấu trúc dự kiến

```text
AGENTS.md
docs/
  library/{design,screens,architecture,mock-contracts}.md
  reference/                 # nguồn và screenshot, chỉ tham chiếu
  qa/                       # báo cáo kiểm tra từng milestone
src/
  app/
    layout.tsx              # fonts, global styles, metadata base
    globals.css
    (public)/
      layout.tsx            # shared public context, không ép site chrome
      page.tsx
      explore/page.tsx
      stories/[storySlug]/page.tsx
      stories/[storySlug]/chapters/[chapterSlug]/page.tsx
      authors/[authorSlug]/page.tsx
      loading.tsx
      error.tsx
      not-found.tsx
  components/ui/            # chỉ primitive thật sự tái sử dụng
  styles/tokens.css
  features/library/
    components/{navigation,discovery,search,story,reader,author}/
    data/{library.repository,mock-library.repository}.ts
    types/{library,filters}.ts
    mock/{authors,stories,chapters,editorial}.ts
    mock/content/           # original English prose
    utils/{filters,query-params,reading-time,formatting}.ts
    utils/reader-storage.ts
public/mock/{covers,heroes,avatars}/
tests/e2e/
```

Các directory là ranh giới dự kiến, không bắt buộc tách mỗi thành phần thành một file. `LibraryPageShell` cung cấp header/footer cho bốn màn discovery/detail/profile; reader dùng `ReaderShell`. Giữ URL và route group của foundation, không cần client hook để ẩn header theo pathname.

### B3. Component và dữ liệu

Server Components: nội dung trang, shelves, StoryCard, synopsis, chapter list/body, author works, metadata. Client islands: mobile menu, search/filter controls, follow/save, reader settings/progress và chapter drawer. Truyền prose đã render từ server làm children của reader controls; không import toàn catalog vào client.

Repository có bốn hàm theo foundation: `listStories`, `getStoryBySlug`, `getChapterBySlug`, `getAuthorBySlug`. Mark data implementation server-only; UI không import raw fixture. Trả `null` cho slug không tồn tại; page chuyển thành not-found. Chapter lookup luôn kiểm tra cả story và chapter, không chấp nhận chapter thuộc truyện khác.

Giữ các type hiện có. Bổ sung `firstPublishedAt` cho StorySummary và asset metadata có width/height/focal point; editorial selections là danh sách story IDs riêng, không suy ra từ màu bìa. Chỉ thêm `snapshotId`/`revision` khi cần phân biệt phiên bản mock cho resume; không thiết kế schema database trong phase này.

Fixture dùng tám tác giả và 20 truyện trong mock-contracts. Mỗi story có năm chương truy cập được, original English content theo synopsis. Nocturne có tối thiểu ba chương dài khoảng 1.200-1.800 từ để thử đọc và chuyển chương; các chapter còn lại có nội dung riêng khoảng 350-700 từ, được xác định là sample. Không lặp đoạn văn để kéo dài. Reading time tính từ prose, không giữ 12 phút cho vài đoạn ngắn.

`COMPLETED` là trạng thái câu chuyện giả lập; sample prose được ghi rõ là demo, không tuyên bố đây là tác phẩm thương mại hoàn chỉnh. Review preview dùng `Reviews are coming soon`; không sinh testimonial người đọc giả.

### B4. State và search semantics

| State | Nơi lưu và quy tắc |
|---|---|
| Search/filter/sort/page | URL; form submit và Apply tạo navigation; Back/Forward phục hồi đúng |
| Gõ search, mở panel/menu | React local state; đồng bộ lại khi URL đổi |
| Reader appearance | Versioned localStorage; kiểm tra kiểu, giới hạn số, fallback nếu JSON lỗi hoặc storage bị chặn |
| Follow/save | LocalStorage theo story ID; hiển thị rõ chỉ trên thiết bị, không gọi auth |
| Resume | Story ID + chapter slug + paragraph anchor; không chỉ lưu raw scroll offset |

URL dùng `q`, repeated `genre`, `trope`, `status`, `provenance`, `sort`, `page`. Ví dụ `/explore?genre=fantasy&genre=mystery&status=completed&sort=latest`.

OR trong cùng một nhóm filter, AND giữa các nhóm. Search trim/case-insensitive trên title/author/synopsis/genre/tropes/tags; tách token và yêu cầu mọi token xuất hiện trong nội dung tìm kiếm. Dùng allowlist enum; bỏ giá trị lạ, normalize trùng, clamp page; mỗi lần đổi filter reset page=1. Page size 12 cố định, total tính sau filter. Tie-break bằng slug để thứ tự ổn định. `completed` chỉ sort; status=completed mới giới hạn kết quả.

Sort: latest theo lastPublishedAt; newest theo firstPublishedAt; trending theo isTrending rồi sample rating count; rating theo average rồi count; completed ưu tiên completed rồi latest. Facet tropes lấy từ seed để tránh nút luôn rỗng như Academy khi catalog chưa có. Clear filters giữ q; Clear all xóa q và filter/sort/page về mặc định.

### B5. Design system và responsive

Tokens gốc: ink background `#0B1013`, ivory `#F4EFE7`, coral `#FF7657`, flow `#8CCBD0`; reader Sepia/Dark/White theo design.md. Bảng token đầy đủ được giữ ở một nguồn CSS. Artwork đa thể loại tạo màu sắc khác nhau, UI chrome tiết chế.

Fonts: Anton display, Cormorant Garamond editorial, Inter UI, Source Serif 4 prose. Chỉ load weights cần dùng; reader font chỉ tải ở reader khi khả thi. Local font assets có license hoặc next/font, kiểm tra build khi mạng không ổn định.

1360px max content; gutters desktop 40-56px, tablet 28-36px, mobile 20px/16px. Covers 3:4, radius 0-6px, gap 12-24px. Controls tối thiểu khoảng 44px touch target; icon có accessible name và tooltip phù hợp. Theme bằng swatch/radio, font/width bằng segmented control hoặc select, numeric values bằng slider/stepper.

1440: hero có typography lớn và rail; 1024: rail gộp caption; 768: giảm chiều rộng display, art vẫn là band không đóng khung; 390/320: featured art crop dọc, copy/CTA nằm trong safe area, genre và shelf native scroll. Không ép chiều cao hero khi text zoom. Giữ phần đầu section tiếp theo trong viewport chuẩn khi nội dung cho phép, ưu tiên readability khi zoom.

### B6. Test và metadata

Unit tests tập trung URL round-trip/invalid input, filter composition/sort/pagination, fixture referential integrity, reader-storage validation. E2E kiểm tra discover -> detail -> chapter -> next -> author -> other story, URL refresh/Back, reader persistence, not-found và storage failures.

Ma trận responsive: năm màn hình x 320/390/768/1024/1440px. Screenshot desktop/mobile cho mỗi milestone có UI; kiểm tra title dài nhất, reduced motion, zoom 200%, keyboard và focus return ở dialog. Test overflow bằng browser geometry, không chỉ nhìn ảnh.

Metadata per route và nội dung server HTML. Prototype mock mặc định noindex; không xuất AggregateRating/Review structured data từ sample metrics. Canonical production chỉ dùng domain thật khi được xác nhận. Query/filter pages noindex; chính sách index catalog thật được quyết định khi backend hoạt động.

## C. Screen Implementation Breakdown

### C1. Homepage - `/`

- Layout: SiteHeader -> featured hero -> GenreNavigation -> Trending Now -> Fresh Ink -> Beyond the Genre -> Completed Stories -> Studio information -> SiteFooter.
- Components: FeaturedStoryHero, EditorialHeading, StoryShelf, StoryCard, GenreNavigation; reuse shell và EmptyState.
- Data: Nocturne featured, curated IDs cho shelf, lastPublishedAt, completed stories; tất cả resolve qua repository/typed editorial config.
- Interactions: Start Reading tới chương đầu featured; cover/title tới detail; Explore Genres và View all tới URL filter tương ứng; shelf arrows chỉ hiện nếu có overflow và có tác dụng.
- States: hero image fallback vẫn có title/CTA; shelf rỗng được ẩn; skeleton giữ tỷ lệ; catalog lỗi có Retry.
- Responsive: asymmetric section headings desktop; mobile giữ heading + shelf ngang với gợi ý phần cover tiếp theo; hero không clip EXPLORE.
- Acceptance: brand/story/primary CTA đọc được ở viewport đầu; mọi link đi đúng; không số carousel giả cho một feature; artwork thật, không skeleton ở trạng thái hoàn tất.
- Dependencies: M1 tokens, mock catalog, cover/hero assets và shell. Các route chưa tới milestone tương ứng chỉ được coi là pending integration, chưa tuyên bố journey hoàn tất.

### C2. Explore & Search - `/explore`

- Layout: header, Explore Stories, search form, desktop filter rail, results count/sort, active filters, results, pagination.
- Components: SearchInput, FilterControls, ActiveFilters, SortSelect, StoryResult, Pagination.
- Data: đủ 20 story; genres/tropes/status/provenance; StoryListResult và query parser.
- Interactions: submit bằng Enter; multi-filter, Apply mobile, remove filter, clear, sort, page; kết quả và URL đồng bộ, có pending indication.
- States: initial catalog, no results giữ controls, invalid query normalized, repository failure/retry, loading ổn định.
- Responsive: 1440 filter rail + kết quả; 768 filters thu gọn; 390/320 drawer focus-trapped và compact results, không sidebar ép chiều rộng.
- Acceptance: query qua refresh/Back không đổi nghĩa; tổng/page đúng; keyboard dùng toàn bộ controls; mở từng result vào đúng story.
- Dependencies: query/filter tests và StoryCard/StoryResult M1; link đến M4 được xác minh tích hợp sau.

### C3. Story Detail - `/stories/[storySlug]`

- Layout: cover + title/author/status, primary reading action, synopsis/tropes, chapter list, sample metrics/review state, related works.
- Components: StoryHeader, StoryMetadata, ChapterList, LocalStoryActions; Share dùng clipboard có fallback chọn URL.
- Data: StoryDetail, author summary, five chapter summaries, related IDs và local resume.
- Interactions: Start Reading luôn chương đầu; Continue Reading chỉ hiện khi bookmark hợp lệ; author/trope/related links; Follow/Save local toggles có trạng thái và feedback.
- States: unknown story=404; no chapters=reading action không hoạt động và có giải thích; no rating=no score; clipboard denied hiện URL chọn được; image fallback.
- Responsive: desktop cover vừa + information area; mobile cover/title trước, CTA dễ thấy, chapter rows không tràn khi title dài.
- Acceptance: count/date/latest khớp chapters; mỗi chapter có body; mọi mock metric có ngữ cảnh demo; không link Studio/private data.
- Dependencies: repository, catalog, shell; reader và author destinations hoàn tất M5/M6.

### C4. Chapter Reader - `/stories/[storySlug]/chapters/[chapterSlug]`

- Layout: minimal reader header, breadcrumb/title, discreet progress, selectable prose, prev/next và TOC drawer; không mang header/footer discovery vào canvas.
- Components: ReaderShell, ReaderToolbar, ReaderSettings, ChapterBody, ReaderProgress, ChapterNavigation.
- Data: ChapterDetail, ordered siblings, preferences và resume anchor. Markdown parser không bật raw HTML; link protocols được kiểm soát.
- Interactions: Sepia/Dark/White; Serif/Sans; font 16-28px; line-height 1.5-2.1; narrow/default/wide; TOC; previous/next; optional Resume khi quay lại.
- Progress: chỉ tính vùng prose, clamp 0-100; cập nhật sau resize/font/theme-layout changes; chương ngắn có cách tính hợp lý, không chia cho zero. Không announce mỗi phần trăm qua screen reader.
- States: wrong story/chapter=404; boundary prev/next disabled đúng; corrupt/unavailable storage về defaults; missing bookmark chapter bỏ resume; body render độc lập settings hydration.
- Responsive: default 18px desktop/17px mobile, line-height 1.75, 60-75ch ở desktop; width giới hạn bằng viewport trừ gutter, toolbar không che chữ.
- Acceptance: đọc ít nhất một chapter dài và chuyển liên tiếp ba chapter; preference còn sau reload; theme có contrast; focus/selection/scroll không bị giật khi controls hoạt động; không hydration warning.
- Dependencies: M4 chapter contract, M1 prose fixtures và font strategy. Settings giá trị trên là đề xuất cụ thể hóa các preset trong screens.md.

### C5. Author Profile - `/authors/[authorSlug]`

- Layout: avatar/name/bio, joined year/genres/totals, public works grid, footer.
- Components: AuthorHeader, AuthorMetadata, AuthorWorks, StoryCard.
- Data: tám AuthorProfile dựng từ author seed + works relation; totals tính từ dữ liệu.
- Interactions: mở story, genre filter; chỉ render external links nếu có explicit data hợp lệ.
- States: unknown author=404; empty works trong fixture test có EmptyState; avatar fail có initials; bio dài vẫn reflow.
- Responsive: desktop unframed identity band; mobile avatar/name compact, bio dễ đọc, works hai cột nếu đủ chỗ, một cột ở narrow khi cần.
- Acceptance: tác phẩm đúng tác giả, count khớp, không fake verified/social counts; link story-author-story chạy trọn luồng.
- Dependencies: M1 authors/catalog và M4 detail links; không phụ thuộc auth/follower backend.

## D. Implementation Milestones

### M1 - Design Foundation

- Scope: đưa foundation/reference vào repo, ghi các quyết định đã duyệt; scaffold App Router; tokens/fonts/primitives/shell; types/repository/20 stories/8 authors/100 chapter fixtures; asset inventory.
- Files: `AGENTS.md`, `docs/library/*`, `docs/reference/*`, `package.json`, lockfile, TS/ESLint/PostCSS config, `src/app/layout.tsx`, globals/tokens, `features/library/{types,data,mock,utils}`, basic UI, test config, `.gitignore`.
- Dependencies: duyệt kế hoạch; kiểm tra Node/npm versions và package compatibility; không cần backend credentials.
- Acceptance: strict types; fixtures không trùng ID/slug, chapter links/counts đúng; tokens và fonts render; 20 cover paths có asset hợp lệ hoặc được ghi rõ pending, không coi asset pending là hoàn tất visual.
- Verification: typecheck/lint/build, domain tests, preview shell 1440/390/320 và font-loading/contrast checks.
- Risk: mock content lớn và assets thiếu. Ưu tiên hoàn thiện featured art cùng năm cover Trending trước M2, hoàn tất tất cả cover trước M3; skeleton chỉ dùng lúc loading.

### M2 - Homepage

- Scope: homepage đủ section theo C1, hero và shelf dùng artwork thực, menu/search navigation, polished hover/focus/native scroll.
- Files: `(public)/page.tsx`, discovery/navigation components, editorial fixtures, `public/mock/heroes/*`, covers, `docs/qa/m2.md`.
- Dependencies: M1; featured art và cover nhìn thấy ở homepage.
- Acceptance: bố cục reference nhận diện rõ; typography/art/rail cân đối; UI hoạt động ở cả năm width; các điểm đến chưa triển khai ghi pending trong QA.
- Verification: browser screenshots năm width; keyboard, overflow, image decode, actual link href và loading/error fixtures.
- Risk: giant type và mobile crop; sửa composition ở milestone này trước khi nhân rộng component sang trang khác.

### M3 - Explore & Search

- Scope: filter/search/sort/pagination theo URL; đủ catalog và toàn bộ 20 covers.
- Files: `explore/page.tsx`, search components, query/filter utils/tests, E2E explore tests, remaining assets.
- Dependencies: M1 contracts + shared cards M2.
- Acceptance: search/filter/back/refresh, valid empty state, URL canonicalization ổn định, accessible filter drawer.
- Verification: unit combinations/invalid params/ties/pages; E2E apply-clear-back-reload; screenshots năm width.
- Risk: UI và URL lệch state; URL là committed source of truth, local draft chỉ sống trong mobile Apply panel.

### M4 - Story Detail

- Scope: metadata/synopsis/chapters/related, local follow/save, share, mock ratings/review state.
- Files: story page, story components, local action storage, repository integrity tests, detail E2E.
- Dependencies: M1 fixtures + M2 shell/card + M3 genre deep links.
- Acceptance: mọi story đúng author và chapter summaries; local actions trung thực; CTA đúng URL; 404/fallback hoạt động.
- Verification: all-story route smoke, storage reload, clipboard fallback, keyboard và screenshots. Reader destination còn pending tới M5.
- Risk: sample data nhìn như production; giữ Demo catalog và Sample ratings trong đúng ngữ cảnh.

### M5 - Chapter Reader

- Scope: prose rendering, appearance controls, TOC, progress, resume, next/previous, reader-only shell.
- Files: chapter route, reader components, reader-storage util/tests, content fixtures nếu cần chỉnh, reader E2E.
- Dependencies: M4 routing + M1 long prose và fonts.
- Acceptance: chapter navigation hai đầu đúng; preferences còn sau reload; progress/resume đúng khi thay font/width; không overflow hoặc toolbar che prose.
- Verification: themes x font-size extremes ở 390/1440, narrow 320, three-chapter journey, blocked/corrupt localStorage, zoom/keyboard/reduced-motion.
- Risk: flash theme/hydration/scroll drift; đọc storage với guard, dùng CSS variables và stable paragraph anchors, chỉ restore sau layout/fonts sẵn sàng.

### M6 - Author Profile

- Scope: public identity, bio, derived metadata/works, avatar fallback.
- Files: author route/components, full author profiles, author E2E.
- Dependencies: M1 relation model, M4 detail, shared cards.
- Acceptance: tám profiles đúng works/totals; empty/unknown fixture đúng; từ story sang author rồi story khác chạy được.
- Verification: all-author route smoke, long bio/avatar fallback, screenshots năm width, keyboard.
- Risk: duplicated counts; repository tính totals từ một nguồn fixture.

### M7 - Integration & Visual Quality

- Scope: hoàn tất mọi destination, visual consistency, loading/error/not-found, metadata/noindex, accessibility và performance review; README run instructions.
- Files: targeted fixes, `tests/e2e/*`, `docs/qa/final.md`, screenshots, README scripts/instructions.
- Dependencies: M1-M6. Không đánh dấu hoàn tất khi link route còn pending.
- Acceptance: discover-search-detail-reader-author loop chạy; không dead control, broken image, console/hydration error; type/lint/tests/build pass; mọi giới hạn ghi bằng evidence.
- Verification: production build + local start; 25 viewport/screen combinations; all 20 story/8 author/100 chapter links kiểm tra bằng data integrity và route smoke; Chromium E2E, thêm Firefox/WebKit smoke nếu runtime hỗ trợ; axe và manual keyboard.
- Performance: đo ít nhất ba lượt lab với cấu hình ghi lại, báo median LCP/CLS và thao tác tương tác. Mục tiêu LCP <2.5s, CLS <0.1; INP <200ms là mục tiêu cần field data, không suy ra từ Lighthouse score. Sửa regressions có bằng chứng trước khi mở rộng tối ưu.
- Risk: lab không phản ánh production/thiết bị thật. Báo rõ browser, viewport, build mode, limitations; mở local dev server ở port trống và giao URL để bạn thử.

Sau mỗi milestone: báo files thay đổi, check đã chạy, screenshot và hạn chế. Sau một lần duyệt kế hoạch có thể tiếp tục tuần tự khi đạt acceptance; nếu có thay đổi lớn so với kế hoạch hoặc blocker khiến milestone chưa đạt, báo cụ thể để xử lý, không tự bỏ qua.

## E. Visual Fidelity Strategy

Reference có header khoảng 80px, chữ EXPLORE lớn bên trái, art kéo về giữa/phải, rail serif hẹp, genre strip ngay dưới và Trending với title rail bên trái. Giữ các mối quan hệ này, không lấy pixel screenshot làm artwork website.

1. Typography: Anton tạo khối condensed, Cormorant tạo tương phản serif; hiệu chỉnh tỷ lệ với chiều cao hero thực tế. EXPLORE phải đọc trọn, không dùng negative tracking hoặc kéo giãn font.
2. Hero: một band ảnh full-bleed không viền/card; focal subject ở giữa/phải, vùng trái và rail có độ tương phản tự nhiên. Copy overlay không đè nhân vật hoặc chi tiết chính; InkFlow có dấu hiệu thương hiệu đủ rõ ngoài nav nhỏ.
3. Image crop: hero bản landscape khoảng 2400x1200 và crop mobile có chủ đích; cover 900x1200; dùng focal point metadata và responsive sizes. Không darken/blur tới mức không nhìn được nội dung minh họa.
4. Rhythm: giữ khoảng nghỉ giữa hero/genre/shelves, section gap theo token; giảm hợp lý trên mobile, không hàng loạt floating panels.
5. Color: nền ink và ivory, coral cho primary/selected; cover mỗi genre có palette riêng. Không để toàn catalog thành dark-blue fantasy.
6. Story cards: cover 3:4, title/genre ngắn, metadata thêm ở Explore/Detail; heart/save icon tách khỏi link cover, focus rõ, không nested interactive links.
7. Asymmetry: heading rail ở shelf desktop, titles có thể xuống dòng có chủ đích; mobile đưa heading lên trên và giữ cover overflow cue.

Asset inventory còn thiếu: 20 covers, một featured hero với mobile crop, tám avatar fictional hoặc illustrated, logo/wordmark vector/text được xác nhận và font license records. Beyond the Genre có thể dùng crop cover đã tạo để tránh thêm ảnh trang trí.

Không có quyền tái sử dụng riêng từng artwork chỉ vì có screenshot tham khảo. Tạo original bitmap art theo genre/synopsis, không có text UI trong ảnh. Ghi `docs/reference/assets.md` với path, nguồn/cách tạo, title, dimensions, crop, alt và license/usage note. Không gọi công cụ tạo ảnh trước khi kế hoạch được duyệt.

Visual review dùng screenshot side-by-side ở cùng width, đánh giá hierarchy/art crop/type/spacing/CTA theo checklist; không đưa tỷ lệ giống reference giả tạo. Asset thiếu là giới hạn milestone rõ ràng, không che bằng gradient để tuyên bố fidelity hoàn tất.

## F. Risks, Trade-offs và điều kiện hoàn tất

| Risk | Hệ quả | Cách xử lý |
|---|---|---|
| Artwork chưa có | UI đúng layout nhưng mất identity | Featured art + first shelf sớm, kiểm tra toàn bộ 20 covers trước Explore nghiệm thu |
| Dữ liệu ví dụ chưa đầy đủ | Chapter links chết, author counts sai | Chuẩn hóa fixtures và derive metadata trước các page |
| Hero typography trên mobile | Overflow/CTA biến mất | Test 320px và zoom, bố cục riêng mobile, fixed type tokens |
| Nhiều client components | Tải toàn catalog, hydration nặng | Server content/repository, client controls nhỏ, kiểm tra bundle |
| Mock coupling | Khó đổi backend | Typed repository, public DTO, pure query parser, không import fixture trong UI |
| Bốn font và ảnh lớn | LCP/layout shift | Giảm weights, dimensions rõ, font scope, responsive image sizes và lazy loading đúng |
| Dark palette/motion/drawers | Khó đọc hoặc keyboard kẹt | Contrast thực tế, focus management, reduced motion, kiểm tra thủ công |
| Local storage bị chặn | Reader crash hoặc mất state | Guard/validate/fallback; lưu local không bảo đảm account sync |
| UI demo bị hiểu là live | Sai kỳ vọng sản phẩm | Demo catalog, sample metrics, local action labels và noindex |
| Scope creep từ PRD | FE phụ thuộc Studio/Canon/backend | Chỉ public snapshot-shaped fixtures; future backend ghi interface, chưa triển khai |

Kết quả phase này chứng minh frontend và reader journey hoạt động với mock. Không chứng minh RLS, auth, moderation, publishing immutability trên database hay khả năng chịu tải production.

Kiểm chứng sản phẩm sau M2/M5/M7: cho người đọc thử chọn một truyện theo genre, giải thích vì sao muốn đọc, đọc một chương và đổi appearance. Ghi chỗ họ dừng/tìm sai/khó đọc; dùng kết quả để quyết định chỉnh layout trước khi đầu tư backend.

## G. Trạng thái và bước duyệt

Đã hoàn tất repository/source/screenshot inspection và viết kế hoạch này. Chưa scaffold, cài package, tạo asset, sửa application code, chạy build/test ứng dụng hoặc push GitHub. Các verification ở trên là công việc tương lai, không phải test đã pass.

Bạn duyệt kế hoạch và các quyết định tại A4 để bắt đầu M1. Approval gate đến trực tiếp từ master prompt mục 10-11: "After presenting the plan, wait for approval before implementing."

### Tài liệu kỹ thuật đối chiếu

- Next.js installation: https://nextjs.org/docs/app/getting-started/installation
- Next.js Server/Client composition: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Tailwind CSS theme variables: https://tailwindcss.com/docs/theme

Các nguồn này dùng xác nhận cách scaffold, ranh giới component và token mapping; exact package version phải resolve và kiểm tra compatibility tại M1.
