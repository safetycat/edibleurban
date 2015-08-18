<script type="text/ng-template" id="map_popup">
<div>
{{name}}
<hr />
{{image ? "<img src='" : ""}} {{image}} {{image ? "'/>" : ""}}
{{body}}
<hr />
{{area_type}} <br />
{{suggestedUses}}
</div>
</script>