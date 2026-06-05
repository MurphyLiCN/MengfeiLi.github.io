---
layout: splash
permalink: /
title: "李梦飞"
author_profile: false
redirect_from:
  - /about/
  - /about.html
---

{% include base_path %}
{% assign featured_publications = site.publications | where: "featured", true | sort: "featured_order" %}

<div class="home-profile">
  <div class="home-profile__content">
    <p class="home-profile__kicker">AI-based Empirical Operations Management</p>
    <h1>Mengfei Li <span>李梦飞</span></h1>
    <p class="home-profile__affiliation">PhD Candidate in Management Science, School of Management, Fudan University</p>
    <p class="home-profile__market">
      On the <strong>2026-2027 academic job market</strong> for tenure-track positions in Operations Management.
    </p>
    <p class="home-profile__summary">
      I study how AI, causal machine learning, and structural model estimation can improve empirical operations research. My work focuses on manufacturing learning, operational consistency, supply chain resilience, and data-driven decision models.
    </p>
    <nav class="home-profile__links" aria-label="Profile links">
      <a href="mailto:mfli22@m.fudan.edu.cn">Email</a>
      <a href="{{ base_path }}/cv/">CV</a>
      <a href="{{ base_path }}/publications/">Research</a>
      <a href="{{ base_path }}/projects/">Projects</a>
      <a href="{{ base_path }}/talks/">Talks</a>
      <a href="https://github.com/MurphyLiCN" target="_blank" rel="noopener noreferrer">GitHub</a>
    </nav>
  </div>
  <figure class="home-profile__portrait">
    <img src="{{ base_path }}/images/profile.jpg" alt="Mengfei Li" width="360" height="360" loading="eager" decoding="async" fetchpriority="high">
  </figure>
</div>

<section class="home-section" aria-labelledby="research-heading">
  <h2 id="research-heading">Featured Research</h2>
  {% if featured_publications.size > 0 %}
  <ol class="home-publication-list">
    {% for post in featured_publications %}
    <li>
      <a href="{{ base_path }}{{ post.url }}">{{ post.title }}</a>
      <span>{{ post.venue }}{% if post.excerpt %}. {{ post.excerpt }}{% endif %}</span>
      {% assign paperurl = post.paperurl | default: "" | strip %}
      {% if paperurl != "" %}
        <span class="home-publication-list__links"><a href="{{ paperurl }}" target="_blank" rel="noopener noreferrer">SSRN</a></span>
      {% endif %}
    </li>
    {% endfor %}
  </ol>
  {% endif %}
  <p class="home-section__more"><a href="{{ base_path }}/publications/">Full research list</a></p>
</section>

<section class="home-section home-section--split" aria-label="Profile highlights and contact">
  <div>
    <h2>Profile Highlights</h2>
    <ul class="home-compact-list">
      <li><strong>Advisor:</strong> <a href="https://www.fdsm.fudan.edu.cn/En/2025/1106/c1052a24525/page.htm" target="_blank" rel="noopener noreferrer">Prof. Xiaole Wu</a>, School of Management, Fudan University</li>
      <li><strong>Principal Investigator</strong>, NSFC Young Student Basic Research Project, Jan 2025 - Dec 2027</li>
      <li><strong>Outstanding Student Model</strong>, Fudan University, 2025</li>
      <li><strong>Visiting PhD Student</strong>, <a href="https://kelley.iu.edu/index.html" target="_blank" rel="noopener noreferrer">Kelley School of Business, Indiana University</a>, hosted by <a href="https://kelley.iu.edu/faculty-research/faculty-directory/profile.html?id=WENCZHAN" target="_blank" rel="noopener noreferrer">Prof. Wenchang Zhang</a>, Sep - Dec 2024</li>
    </ul>
  </div>
  <div>
    <h2>Contact</h2>
    <ul class="home-compact-list">
      <li><strong>Email:</strong> <a href="mailto:mfli22@m.fudan.edu.cn">mfli22@m.fudan.edu.cn</a></li>
      <li><strong>Affiliation:</strong> School of Management, Fudan University, Shanghai</li>
      <li><strong>CV:</strong> <a href="{{ base_path }}/cv/">web version</a></li>
    </ul>
  </div>
</section>

<section class="home-section" aria-labelledby="talks-heading">
  <h2 id="talks-heading">Recent Talks</h2>
  <ul class="home-compact-list">
    <li><strong>2025 INFORMS International Meeting</strong>, Singapore, July 2025</li>
    <li><strong>35th POMS Annual Conference</strong>, Atlanta, USA, May 2025</li>
    <li><strong>Workshop on Empirical Operations Management</strong>, Hong Kong, China, January 2025</li>
    <li><strong>2024 INFORMS Annual Meeting</strong>, Seattle, USA, October 2024</li>
  </ul>
  <p class="home-section__more"><a href="{{ base_path }}/talks/">Full talks list</a></p>
</section>
