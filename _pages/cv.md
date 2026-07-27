---
layout: archive
title: "Curriculum Vitae"
permalink: /cv/
description: "Academic CV of Mengfei Li, a Management Science PhD candidate at Fudan University on the 2026-2027 Operations Management job market."
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<p class="cv-downloads">
  <a href="{{ base_path }}/files/Mengfei-Li-CV-English.pdf" class="btn" download="Mengfei-Li-CV-English.pdf">
    English PDF
  </a>
  <a href="{{ base_path }}/files/Mengfei-Li-CV.pdf" class="btn" download="Mengfei-Li-CV.pdf">
    中文 PDF
  </a>
</p>

## Education

- **Ph.D. Candidate in Management Science**, Fudan University, Sep 2022 - Jun 2027 (expected)
  - School of Management, Department of Management Science
  - Advisor: **Prof. Xiaole Wu**
- **Visiting Ph.D. Student**, Indiana University, Sep 2024 - Dec 2024
  - Kelley School of Business, Operations & Decision Technologies
  - Host: **Prof. Wenchang Zhang**
- **B.S. in Statistics**, Fudan University, Sep 2018 - Jun 2022
  - School of Management, Department of Statistics
  - Advisor: **Prof. Feiyu Jiang**

## Research Interests

<ul>
  {% for interest in site.data.profile.research.interests %}<li>{{ interest }}</li>{% endfor %}
</ul>

## Publications and Manuscripts

### Published

{% include publication-list.html category="published-papers" %}

### Forthcoming

{% include publication-list.html category="forthcoming" %}

### Under Review

{% include publication-list.html category="under-review" %}

### Working Papers

{% include publication-list.html category="working-papers" %}

## Grants and Research Projects

{% include project-list.html lang="en" compact=true %}

## Conference Presentations

{% include talk-list.html context="cv" show_participation=true %}

## Honors and Awards

{% include award-list.html lang="en" %}

## Teaching Experience

- **Teaching Assistant**, MBA course: Science and Technology Innovation Young Cadre Program (科创青干营)
- **Teaching Assistant**, undergraduate course: Operations Management

## Academic Service

- Anonymous reviewer, *Journal of Asian Economics*

## Books, Data Resources, and Software

- Participant, National Development and Intelligent Governance Laboratory Basic Research and Visualization Platform, Fudan University
- Participant, *China Foreign Merchandise Trade and Supply Chain Volatility Index*, Fudan University Global Supply Chain Research Center
- Contributor, *Operations Management in the Digital Era* (tentative title), edited by Xiaole Wu et al.
- Creator and maintainer, R package [SFHNV](https://github.com/MurphyLiCN/SFHNV){:target="_blank" rel="noopener noreferrer"}
