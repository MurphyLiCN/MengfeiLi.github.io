#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "yaml"

ROOT = File.expand_path("..", __dir__)
ERRORS = []

def error(message)
  ERRORS << message
end

def read_yaml(path)
  YAML.safe_load(
    File.read(path, encoding: "UTF-8"),
    permitted_classes: [Date],
    aliases: true
  )
rescue StandardError => e
  error("#{path}: invalid YAML (#{e.message})")
  {}
end

def read_front_matter(path)
  text = File.read(path, encoding: "UTF-8")
  match = text.match(/\A---\s*\n(.*?)\n---\s*\n/m)
  unless match
    error("#{path}: missing YAML front matter")
    return {}
  end
  YAML.safe_load(match[1], permitted_classes: [Date], aliases: true) || {}
rescue StandardError => e
  error("#{path}: invalid front matter (#{e.message})")
  {}
end

def require_fields(path, data, fields)
  fields.each do |field|
    value = data[field]
    error("#{path}: missing #{field}") if value.nil? || (value.respond_to?(:empty?) && value.empty?)
  end
end

publication_paths = Dir[File.join(ROOT, "_publications", "*.md")].sort
publications = publication_paths.to_h { |path| [path, read_front_matter(path)] }
valid_categories = %w[published-papers forthcoming under-review working-papers]
valid_statuses = %w[published forthcoming under-review working-paper]
expected_category = {
  "published" => "published-papers",
  "forthcoming" => "forthcoming",
  "under-review" => "under-review",
  "working-paper" => "working-papers"
}

publication_permalinks = []
publications.each do |path, publication|
  require_fields(
    path,
    publication,
    %w[title authors collection category permalink excerpt status status_label sort_order updated language keywords]
  )
  error("#{path}: collection must be publications") unless publication["collection"] == "publications"
  error("#{path}: unknown category #{publication['category']}") unless valid_categories.include?(publication["category"])
  error("#{path}: unknown status #{publication['status']}") unless valid_statuses.include?(publication["status"])
  error("#{path}: status/category mismatch") unless expected_category[publication["status"]] == publication["category"]
  error("#{path}: authors must be a non-empty list") unless publication["authors"].is_a?(Array) && !publication["authors"].empty?
  error("#{path}: keywords must be a non-empty list") unless publication["keywords"].is_a?(Array) && !publication["keywords"].empty?
  error("#{path}: do not use a synthetic date field") if publication.key?("date")
  if publication["status"] == "published"
    require_fields(path, publication, %w[publication_date venue publisher pages doi paper_url pdf_url])
  elsif publication.key?("publication_date")
    error("#{path}: publication_date is only allowed for published work")
  end
  publication_permalinks << publication["permalink"]
end

duplicates = publication_permalinks.tally.select { |_permalink, count| count > 1 }.keys
error("duplicate publication permalinks: #{duplicates.join(', ')}") unless duplicates.empty?

sme_path = File.join(ROOT, "_publications", "2025-experience-based-learning-smes.md")
sme = publications[sme_path] || {}
expected_sme_title = "Experience-Based Learning in SMEs: A Dual Perspective on Manufacturing Efficiency and Consistency"
expected_sme_authors = ["Mengfei Li", "Wenchang Zhang", "Yue Cheng", "Liu Ming", "Xiaole Wu"]
error("SME paper title must match SSRN") unless sme["title"] == expected_sme_title
error("SME paper authors must match SSRN") unless sme["authors"] == expected_sme_authors
error("SME paper SSRN URL is incorrect") unless sme["ssrn_url"] == "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5273302"

talk_paths = Dir[File.join(ROOT, "_talks", "*.md")].sort
talks = talk_paths.to_h { |path| [path, read_front_matter(path)] }
talks.each do |path, talk|
  require_fields(
    path,
    talk,
    %w[title collection presentation_type permalink venue sort_date display_date location]
  )
  error("#{path}: collection must be talks") unless talk["collection"] == "talks"
  error("#{path}: do not use a synthetic date field") if talk.key?("date")
  case talk["presentation_type"]
  when "Conference presentation"
    require_fields(path, talk, %w[presenter paper_id])
  when "Conference participation"
    require_fields(path, talk, %w[participant])
  else
    error("#{path}: unknown presentation_type #{talk['presentation_type']}")
  end
end

deleted_workshop = File.join(ROOT, "_talks", "2025-01-eom-workshop-learning-curve.md")
error("deleted supervisor workshop entry still exists") if File.exist?(deleted_workshop)

projects = read_yaml(File.join(ROOT, "_data", "projects.yml"))
awards = read_yaml(File.join(ROOT, "_data", "awards.yml"))
error("_data/projects.yml must contain four projects") unless projects.is_a?(Array) && projects.length == 4
error("_data/awards.yml must contain awards") unless awards.is_a?(Array) && !awards.empty?

expected_project_dates = {
  "nsfc-young-student" => %w[2025-01 2027-12],
  "state-grid-resilience" => %w[2025-02 2026-12],
  "photovoltaic-structural-model" => %w[2025-12 2026-12],
  "nsfc-supply-chain-resilience" => %w[2023-01 2027-12]
}
projects.to_a.each do |project|
  require_fields("_data/projects.yml:#{project['id']}", project, %w[id title_en title_zh funder_en funder_zh role_en role_zh start end])
  expected = expected_project_dates[project["id"]]
  error("#{project['id']}: unexpected project dates") if expected && [project["start"], project["end"]] != expected
end

role_model = awards.to_a.find { |award| award["id"] == "fudan-outstanding-student-role-model" }
error("Fudan role-model award must say one of 20 university-wide recipients") unless role_model && role_model["note_en"] == "One of 20 university-wide recipients"

required_artifacts = [
  "files/Mengfei-Li-CV.pdf",
  "files/Mengfei-Li-CV-English.pdf",
  "cv/Mengfei-Li-CV-English.docx",
  "images/profile-320.avif",
  "images/profile-320.webp",
  "images/profile-640.avif",
  "images/profile-640.webp"
]
required_artifacts.each do |relative_path|
  path = File.join(ROOT, relative_path)
  error("missing artifact #{relative_path}") unless File.file?(path) && File.size(path).positive?
end

content_paths = [
  File.join(ROOT, "_config.yml"),
  *Dir[File.join(ROOT, "_pages", "*")],
  *Dir[File.join(ROOT, "_publications", "*")],
  *Dir[File.join(ROOT, "_talks", "*")],
  *Dir[File.join(ROOT, "_data", "*")]
].select { |path| File.file?(path) }
content = content_paths.map { |path| File.read(path, encoding: "UTF-8") }.join("\n")
{
  /\b1[3-9]\d{9}\b/ => "possible mainland-China mobile number",
  /2000-06/ => "private birth month",
  %r{(?:/Users/|/home/)[^/\s]+/} => "private local path",
  %r{[A-Z]:\\Users\\[^\\\s]+\\}i => "private Windows path",
  /Workshop on Empirical Operations Management/ => "deleted workshop",
  /\(CCF-A\)/ => "unnecessary ranking label"
}.each do |pattern, label|
  error("public content contains #{label}") if content.match?(pattern)
end

if ERRORS.empty?
  puts "Content checks passed: #{publications.length} publications, #{talks.length} talks, #{projects.length} projects."
else
  warn ERRORS.map { |message| "ERROR: #{message}" }.join("\n")
  exit 1
end
