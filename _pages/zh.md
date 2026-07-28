---
layout: archive
title: "李梦飞｜中文简介"
seo_title: "李梦飞｜复旦大学管理学院管理科学系"
permalink: /zh/
description: "李梦飞是复旦大学管理学院管理科学系博士研究生，现正参加 2026—2027 学年运营管理领域的国际教职招聘，目标岗位为长聘轨教职，预计于 2027 年 6 月毕业。"
lang: zh-CN
alternate_en_url: /
alternate_zh_url: /zh/
author_profile: true
---

{% include base_path %}
{% assign nsfc_project = site.data.projects | where: "id", "nsfc-young-student" | first %}
{% assign role_model_award = site.data.awards | where: "id", "fudan-outstanding-student-role-model" | first %}

## 个人简介

我现为复旦大学管理学院管理科学系博士研究生，师从<a href="https://www.fdsm.fudan.edu.cn/En/2025/1106/c1052a24525/page.htm" target="_blank" rel="noopener noreferrer">吴肖乐教授</a>，预计于 **{{ site.data.profile.job_market.expected_graduation_zh }}**毕业。2024 年 9 月至 12 月，我曾在美国印第安纳大学<a href="https://kelley.iu.edu/index.html" target="_blank" rel="noopener noreferrer">凯莱商学院</a>运营与决策技术系访学，访学期间由<a href="https://kelley.iu.edu/faculty-research/faculty-directory/profile.html?id=WENCZHAN" target="_blank" rel="noopener noreferrer">张文昌教授</a>指导。

**{{ site.data.profile.job_market.statement_zh }}**

{{ site.data.profile.research.statement_zh }}

2025 年，我获评<a href="{{ role_model_award.url }}" target="_blank" rel="noopener noreferrer"><strong>{{ role_model_award.title_zh }}</strong></a>，为{{ role_model_award.note_zh }}；现主持{{ nsfc_project.funder_zh }}《{{ nsfc_project.title_zh }}》（{{ nsfc_project.display_date_zh }}）。

## 研究方向

- 基于人工智能的实证运营管理
- 因果机器学习
- 结构模型估计
- 制造业中的经验学习、效率与一致性
- 供应链韧性

## 代表性研究

{% include publication-list.html featured=true ordered=true limit=4 compact=true lang="zh" show_summary=true %}

<p class="home-section__more"><a href="{{ base_path }}/publications/">查看完整研究成果列表（英文）</a></p>

## 代表性学术报告

{% include selected-presentation-list.html limit=4 lang="zh" show_title=true %}

<p class="home-section__more"><a href="{{ base_path }}/talks/">查看完整学术报告列表（英文）</a></p>

## 科研项目

{% include project-list.html lang="zh" show_scope=true %}

## 荣誉

{% include award-list.html lang="zh" limit=1 %}

## 联系方式与相关链接

- 邮箱：[mfli22@m.fudan.edu.cn](mailto:mfli22@m.fudan.edu.cn)
- 所在单位：[复旦大学管理学院](https://www.fdsm.fudan.edu.cn/){:target="_blank" rel="noopener noreferrer"}（上海）
- 学术主页：[Google Scholar]({{ site.author.googlescholar }}){:target="_blank" rel="noopener noreferrer"} · [ResearchGate]({{ site.author.researchgate }}){:target="_blank" rel="noopener noreferrer"}
- 相关链接：[英文主页]({{ base_path }}/) · [研究成果（英文）]({{ base_path }}/publications/) · [学术报告（英文）]({{ base_path }}/talks/) · [网页版简历（英文）]({{ base_path }}/cv/) · <a href="{{ base_path }}/files/Mengfei-Li-CV-English.pdf" download="Mengfei-Li-CV-English.pdf">英文简历（PDF）</a> · <a href="{{ base_path }}/files/Mengfei-Li-CV.pdf" download="Mengfei-Li-CV.pdf">中文简历（PDF）</a>
