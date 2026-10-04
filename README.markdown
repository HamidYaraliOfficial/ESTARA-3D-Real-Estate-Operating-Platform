# ESTARA — 3D Real Estate Operating Platform

> Next.js 15 + React + TypeScript + Tailwind CSS + Three.js + React Three Fiber + GSAP + Lenis + NestJS + PostgreSQL/PostGIS + Redis + OpenSearch + S3-compatible Storage

---

# English

## Overview

ESTARA is a multi-tenant digital real estate operating platform designed around a cinematic 3D, flow-based and scroll-driven customer journey. The repository contains a modern web application, a NestJS API, an asynchronous worker, shared TypeScript types/validation/UI primitives, PostgreSQL/PostGIS schema, Redis queue infrastructure, OpenSearch adapter hooks and S3-compatible media storage hooks.

The platform models properties, projects, units, agents, leads, appointments, favorites, saved searches, notifications, audit events, analytics, working hours, tenant branding and operational workflows.

## Core Features

- 3D real-estate hero using Three.js and React Three Fiber.
- Scroll-driven motion hooks using GSAP ScrollTrigger and Lenis.
- Localized UI for English, Persian and Chinese.
- Automatic RTL for Persian and LTR for English/Chinese.
- System, Light, Dark, Red and Blue themes.
- Property discovery with listing type, property type, price, area, rooms and text filters.
- Real database-backed property results through the NestJS API.
- Map-oriented property visualization and geo-query endpoint using PostGIS.
- Property detail flow with media, amenities, price history and scheduling.
- Appointment availability generated from persisted agency working hours.
- Appointment conflict detection against active appointments.
- CRM lead pipeline with backend status updates.
- Behavioral lead scoring from persisted views, favorites, inquiries and appointments.
- Working-hours editor with opening state, start/end times and slot duration.
- Real market metrics calculated from persisted published property data.
- Audit-service foundation and notification-service foundation.
- WebSocket gateway for tenant-scoped real-time communication.
- S3-compatible storage service hooks with safe object keys and MIME validation.
- OpenSearch adapter hooks for reindex and faceting architecture.
- Prisma schema covering multi-tenant real-estate entities.
- Docker Compose development stack.
- Kubernetes-ready manifests for web/API scaling and ingress.
- CI workflow with typecheck, build and security audit steps.
- Playwright smoke tests and backend unit tests.

## Main Repository Structure

```text
apps/
  web/                  Next.js frontend
  api/                  NestJS API + Prisma
  worker/               BullMQ/Redis background worker
packages/
  types/                Shared TypeScript domain types
  validation/           Zod validation schemas
  ui/                   Shared UI primitives
infra/
  postgres/             PostGIS/pg_trgm setup
  k8s/                  Kubernetes manifests
docs/
  architecture.md      Runtime and data architecture
README (1).markdown
```

## Requirements

- Node.js 22+
- pnpm 10+
- Docker Desktop / Docker Engine
- PostgreSQL/PostGIS through the included Docker stack
- Redis through the included Docker stack
- Optional OpenSearch and MinIO through the included Docker stack

## Installation

### 1. Install JavaScript dependencies

```bash
corepack enable
corepack prepare pnpm@10.12.1 --activate
pnpm install
```

### 2. Configure environment variables

```bash
copy .env.example .env
```

PowerShell alternative:

```powershell
Copy-Item .env.example .env
```

### 3. Start infrastructure

```bash
docker compose up -d
```

The development services are available at:

- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- OpenSearch: `localhost:9200`
- MinIO API: `localhost:9000`
- MinIO Console: `localhost:9001`

### 4. Initialize Prisma

```bash
pnpm --filter @estara/api prisma generate
pnpm --filter @estara/api prisma migrate dev --name init
pnpm --filter @estara/api prisma db seed
```

### 5. Start the full monorepo

```bash
pnpm dev
```

Web: `http://localhost:3000`

API: `http://localhost:4000/api`

Swagger: `http://localhost:4000/api/docs`

### 6. Run production builds

```bash
pnpm build
```

### 7. Typecheck

```bash
pnpm typecheck
```

### 8. Run tests

```bash
pnpm test
```

### 9. Run the worker independently

```bash
pnpm --filter @estara/worker dev
```

## Tenant Header for Local Development

Until a production JWT tenant guard is enabled, local API calls may provide the agency id with:

```http
x-agency-id: <agency-uuid>
```

The seed creates an agency with slug `estara-demo`. Retrieve its UUID from PostgreSQL/Prisma before using tenant-scoped API requests.

## Useful API Endpoints

```text
GET    /api/properties
GET    /api/properties/:slug
GET    /api/properties/nearby?lat=40.38&lng=49.84&radius=5000
POST   /api/properties
PUT    /api/properties/:id
POST   /api/properties/:id/favorite
DELETE /api/properties/:id/favorite

POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/verify

GET    /api/leads
POST   /api/leads
PATCH  /api/leads/:id/status
POST   /api/leads/:id/score

GET    /api/appointments
GET    /api/appointments/availability
POST   /api/appointments
PATCH  /api/appointments/:id/status

GET    /api/analytics/market
GET    /api/settings/agency
PUT    /api/settings/working-hours
GET    /api/settings/feature-flags

GET    /api/notifications
PATCH  /api/notifications/:id/read
```

## Frontend Routes

```text
/en
/fa
/zh
/en/search
/fa/search
/zh/search
/en/property/:slug
/fa/property/:slug
/zh/property/:slug
/en/crm
/en/admin
/en/settings
```

## Themes

The theme selector supports:

- System
- Light
- Dark
- Red
- Blue

Theme state is persisted in browser storage and applied through CSS custom properties.

## Internationalization

The localization layer currently includes English, Persian and Chinese. Persian uses RTL. English and Chinese use LTR. Number and currency formatting are locale-aware. The locale switcher changes the localized route prefix.

## Scheduling Model

Agency working hours are persisted per weekday. Every day stores:

- Open/closed state
- Opening time
- Closing time
- Appointment slot duration

The availability endpoint generates actual available time slots and excludes overlapping active appointments. The UI continuously updates the current opening state and calculates the next opening time from persisted rules.

## Database

The Prisma schema includes entities for:

- Agencies and tenant settings
- Users, roles and agents
- Cities and neighborhoods
- Properties and property units
- Media and floor plans
- Amenities
- Price and status history
- Favorites and saved searches
- Property views
- Leads, lead status history, notes and tasks
- Appointments
- Working hours
- Inquiries and offers
- Conversations and messages
- Notifications
- Blog content
- Translations
- Feature flags
- Audit logs

PostGIS is enabled by `infra/postgres/01-extensions.sql` and the property model contains geographic coordinate fields plus a PostGIS-compatible geometry field.

## Performance and Accessibility

The frontend includes:

- GPU-aware 3D rendering settings
- Scroll-driven animation hooks
- Reduced-motion detection
- Responsive layouts
- Lazy-safe component boundaries
- Semantic form labels
- Visible focus-compatible UI primitives
- Mobile-first responsive grids

## Deployment

Dockerfiles are provided for the web and API applications. Kubernetes manifests include:

- Namespace
- Web deployment/service
- API deployment/service
- Horizontal Pod Autoscaler
- Ingress
- Pod Disruption Budget

Secrets are expected to be injected by the runtime and are not stored in the repository.

## CI

GitHub Actions runs dependency installation, Prisma generation, typecheck, build and a security audit. Add integration/e2e stages to the protected production pipeline as the deployment environment becomes available.

## Development Data

The Prisma seed creates a dedicated development agency, several cities and neighborhoods, working-hour records and a reproducible set of development properties. Keep this seed dataset isolated from production environments.

## License

Set the project license appropriate to your organization before publishing the repository.

---

# فارسی

## معرفی

ESTARA یک پلتفرم جامع مدیریت و تجربه دیجیتال املاک است که با محوریت رابط سه‌بعدی، جریان‌محور و Scroll-Driven طراحی شده است. این مخزن شامل Frontend با Next.js، Backend با NestJS، Worker پردازش پس‌زمینه، TypeScript مشترک، Validation، UI مشترک، PostgreSQL/PostGIS، Redis، OpenSearch و معماری ذخیره‌سازی S3-compatible است.

سیستم برای مدیریت آژانس‌های چندمستاجری، املاک، واحدها، پروژه‌ها، مشاوران، سرنخ‌ها، قرارهای بازدید، علاقه‌مندی‌ها، جستجوهای ذخیره‌شده، اعلان‌ها، تحلیل بازار، ساعات کاری و Audit طراحی شده است.

## امکانات اصلی

- صفحه اصلی سه‌بعدی با Three.js و React Three Fiber
- انیمیشن Scroll با GSAP و Lenis
- زبان‌های انگلیسی، فارسی و چینی
- راست‌چین کامل فارسی و چپ‌چین انگلیسی/چینی
- تم سیستم، روشن، تاریک، قرمز و آبی
- جستجوی واقعی املاک از API و Database
- فیلتر قیمت، متراژ، نوع ملک، نوع معامله و اتاق‌ها
- جستجوی جغرافیایی با PostGIS
- صفحه جزئیات ملک، رسانه، امکانات و تاریخچه قیمت
- زمان‌بندی واقعی بازدید با ساعات کاری ذخیره‌شده
- جلوگیری از ثبت دو قرار متداخل
- CRM و Kanban لیدها با تغییر واقعی وضعیت در Backend
- امتیازدهی رفتاری Lead بر اساس داده‌های ثبت‌شده
- مدیریت ساعات باز بودن، ساعت شروع، پایان و مدت Slot
- محاسبه شاخص‌های بازار از داده‌های واقعی Database
- زیرساخت WebSocket، Notification، Audit، Search و Object Storage
- Docker Compose و Kubernetes
- تست‌های Backend و Playwright
- GitHub Actions برای کنترل کیفیت و Build

## ساختار

```text
apps/web        فرانت‌اند Next.js
apps/api        بک‌اند NestJS و Prisma
apps/worker     Worker مبتنی بر BullMQ/Redis
packages/types  تایپ‌های مشترک
packages/validation  اعتبارسنجی Zod
packages/ui     کامپوننت‌های UI مشترک
infra            Docker/Kubernetes/PostGIS
```

## نصب

### نصب کتابخانه‌ها

```bash
corepack enable
corepack prepare pnpm@10.12.1 --activate
pnpm install
```

### ساخت فایل محیطی

```powershell
Copy-Item .env.example .env
```

### اجرای زیرساخت

```bash
docker compose up -d
```

### راه‌اندازی Prisma

```bash
pnpm --filter @estara/api prisma generate
pnpm --filter @estara/api prisma migrate dev --name init
pnpm --filter @estara/api prisma db seed
```

### اجرای پروژه

```bash
pnpm dev
```

فرانت‌اند: `http://localhost:3000`

بک‌اند: `http://localhost:4000/api`

Swagger: `http://localhost:4000/api/docs`

## ساعات کاری و زمان بازدید

برای هر روز هفته می‌توان وضعیت باز یا بسته، ساعت شروع، ساعت پایان و طول Slot را وارد کرد. API زمان‌های آزاد واقعی را بر اساس داده‌های ذخیره‌شده محاسبه می‌کند و در صورت وجود قرار متداخل آن Slot حذف می‌شود. رابط کاربری نیز وضعیت باز بودن فعلی و زمان بازشدن بعدی را نمایش می‌دهد.

## Tenant

در محیط توسعه می‌توان برای API از Header زیر استفاده کرد:

```http
x-agency-id: <agency-uuid>
```

شناسه آژانس Seed شده از دیتابیس قابل دریافت است.

## Build و تست

```bash
pnpm typecheck
pnpm build
pnpm test
```

---

# 中文

## 项目介绍

ESTARA 是一个面向现代房地产机构的数字化运营平台，采用 3D、Flow-Based 和 Scroll-Driven 交互设计。项目包含 Next.js 前端、NestJS 后端、Redis/BullMQ Worker、共享 TypeScript 类型、Zod 校验、PostgreSQL/PostGIS、OpenSearch 适配层和 S3-compatible 对象存储架构。

系统覆盖多租户机构、房源、项目、户型、经纪人、客户线索、预约、收藏、保存搜索、通知、审计、市场指标、营业时间以及实时通信等领域。

## 核心功能

- Three.js + React Three Fiber 三维首页
- GSAP ScrollTrigger + Lenis 滚动动画
- English / فارسی / 中文
- 波斯语 RTL，英文和中文 LTR
- System / Light / Dark / Red / Blue 主题
- 基于真实 API 和数据库的房源搜索
- 价格、面积、类型、房间和搜索词过滤
- PostGIS 地理位置搜索
- 房源详情、媒体、设施和价格历史
- 基于机构营业时间的真实预约时段
- 预约冲突检测
- CRM Kanban 线索管理和后端状态更新
- 基于浏览、收藏、咨询和预约行为的 Lead Score
- 营业时间、开始时间、结束时间和 Slot 时长管理
- 从真实数据库聚合市场指标
- WebSocket、Notification、Audit、Search、Storage 架构
- Docker Compose 和 Kubernetes 部署基础
- Backend Unit Test 和 Playwright 测试
- GitHub Actions CI

## 安装

### 安装依赖

```bash
corepack enable
corepack prepare pnpm@10.12.1 --activate
pnpm install
```

### 创建环境文件

```bash
copy .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

### 启动基础设施

```bash
docker compose up -d
```

### 初始化数据库

```bash
pnpm --filter @estara/api prisma generate
pnpm --filter @estara/api prisma migrate dev --name init
pnpm --filter @estara/api prisma db seed
```

### 启动项目

```bash
pnpm dev
```

前端：`http://localhost:3000`

API：`http://localhost:4000/api`

Swagger：`http://localhost:4000/api/docs`

## 营业时间和预约

用户可以为每个星期设置是否营业、开始时间、结束时间以及预约 Slot 时长。API 根据数据库中的规则计算真实可用时间，并排除与已有有效预约冲突的时段。前端同时显示当前是否营业以及下一次开放时间。

## 租户开发模式

本地开发可以使用以下 Header：

```http
x-agency-id: <agency-uuid>
```

Seed 数据创建的机构 UUID 可以从数据库中获得。

## Build 与测试

```bash
pnpm typecheck
pnpm build
pnpm test
```

## 项目结构

```text
apps/web        Next.js 前端
apps/api        NestJS + Prisma 后端
apps/worker     BullMQ/Redis Worker
packages/types  共享类型
packages/validation  Zod 校验
packages/ui     共享 UI
infra            Docker/Kubernetes/PostGIS
```
