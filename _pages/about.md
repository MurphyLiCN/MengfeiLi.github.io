---
layout: splash
permalink: /
title: "Mengfei Li (李梦飞)"
seo_title: "Mengfei Li (李梦飞) · Management Science, Fudan University"
description: "Mengfei Li (李梦飞) is a Management Science PhD candidate at Fudan University on the 2026-2027 academic job market in Operations Management."
lang: en-US
alternate_en_url: /
alternate_zh_url: /zh/
author_profile: false
redirect_from:
  - /about/
  - /about.html
---

{% include base_path %}
{% assign nsfc_project = site.data.projects | where: "id", "nsfc-young-student" | first %}
{% assign role_model_award = site.data.awards | where: "id", "fudan-outstanding-student-role-model" | first %}

<div class="home-profile">
  <div class="home-profile__content">
    <p class="home-profile__kicker">PhD Candidate in Management Science</p>
    <h1>Mengfei Li <span lang="zh-CN">李梦飞</span></h1>
    <p class="home-profile__affiliation">School of Management, Fudan University</p>
    <p class="home-profile__market">
      <strong>{{ site.data.profile.job_market.statement_en }}</strong>
      <span>Expected graduation: {{ site.data.profile.job_market.expected_graduation_en }}.</span>
    </p>
    <p class="home-profile__summary">
      {{ site.data.profile.research.statement_en }}
    </p>
    <p class="home-profile__summary">
      I am advised by <a href="https://www.fdsm.fudan.edu.cn/En/2025/1106/c1052a24525/page.htm" target="_blank" rel="noopener noreferrer"><strong>Prof. Xiaole Wu</strong></a>. From September to December 2024, I was a visiting PhD student in Operations &amp; Decision Technologies at the <a href="https://kelley.iu.edu/index.html" target="_blank" rel="noopener noreferrer">Kelley School of Business, Indiana University</a>, hosted by <a href="https://kelley.iu.edu/faculty-research/faculty-directory/profile.html?id=WENCZHAN" target="_blank" rel="noopener noreferrer">Prof. Wenchang Zhang</a>.
    </p>
    <p class="home-profile__summary">
      In 2025, I was named a <a href="{{ role_model_award.url }}" target="_blank" rel="noopener noreferrer"><strong>{{ role_model_award.title_en }}</strong></a>, as one of 20 university-wide recipients. I am the <strong>{{ nsfc_project.role_en }}</strong> of the {{ nsfc_project.funder_en }}, <em>{{ nsfc_project.title_en }}</em> ({{ nsfc_project.display_date_en }}).
    </p>
    <nav class="home-profile__links" aria-label="Profile links">
      <a href="mailto:mfli22@m.fudan.edu.cn">Email</a>
      <a href="{{ base_path }}/files/Mengfei-Li-CV-English.pdf">CV (English PDF)</a>
      <a href="{{ base_path }}/publications/">Research</a>
      <a href="{{ site.author.googlescholar }}" target="_blank" rel="noopener noreferrer">Google Scholar</a>
    </nav>
  </div>
  <figure class="home-profile__portrait">
    <picture>
      <source
        type="image/avif"
        srcset="{{ base_path }}/images/profile-320.avif 320w, {{ base_path }}/images/profile-640.avif 640w"
        sizes="(max-width: 925px) 180px, 240px"
      >
      <source
        type="image/webp"
        srcset="{{ base_path }}/images/profile-320.webp 320w, {{ base_path }}/images/profile-640.webp 640w"
        sizes="(max-width: 925px) 180px, 240px"
      >
      <img src="{{ base_path }}/images/profile.jpg" alt="Mengfei Li" width="640" height="640" loading="eager" decoding="async" fetchpriority="high">
    </picture>
  </figure>
</div>

<section class="home-section" aria-labelledby="research-heading">
  <h2 id="research-heading">Research</h2>
  {% include publication-list.html featured=true ordered=true limit=4 compact=true %}
  <p class="home-section__more"><a href="{{ base_path }}/publications/">Full research list</a></p>
</section>

<section class="home-section" aria-labelledby="presentations-heading">
  <h2 id="presentations-heading">Selected Presentations</h2>
  {% include selected-presentation-list.html limit=4 %}
  <p class="home-section__more"><a href="{{ base_path }}/talks/">Full presentations list</a></p>
</section>
