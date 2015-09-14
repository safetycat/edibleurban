<script type="text/ng-template" id="map_popup">
<div>
    <div>{{name}}</div>
    <hr />
    <div>
        {{image ? "<img src='" : ""}} {{image}} {{image ? "'/>" : ""}}
        {{body}}
    </div>
    <hr />
    <div>
        {{area_type ? "<span class='category'>Area Type:</span>" : ""}} {{area_type}} <br />
        {{suggestedUses ? "<span class='category'>Suggested Uses:</span>" : ""}} {{suggestedUses}}
    </div>
</div>
</script>